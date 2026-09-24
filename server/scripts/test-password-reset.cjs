const assert = require("node:assert/strict");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const bcrypt = require("bcryptjs");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const prisma = require("../dist/lib/prisma").default;

const {
  createPasswordReset,
  resetPassword,
} = require("../dist/services/passwordReset.service");

const {
  matchesPasswordResetOtp,
} = require("../dist/lib/otp");

let testUserId;

async function main() {
  // Create a temporary password-based account.
  const email = `reset-test-${randomUUID()}@example.com`;
  const originalPassword = randomUUID();
  const passwordHash = await bcrypt.hash(originalPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: "Password reset test",
      email,
      password: passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  testUserId = user.id;

  // Two simultaneous requests: exactly one should be allowed.
  const beforeRequest = Date.now();

  const results = await Promise.allSettled([
    createPasswordReset({ email }),
    createPasswordReset({ email }),
  ]);

  // Wait for both requests before checking or cleaning up.
  const successfulResults = results.map((result) => {
    if (result.status === "rejected") {
      throw result.reason;
    }

    return result.value;
  });

  const allowed = successfulResults.filter(
    (result) => result !== null
  );

  const blocked = successfulResults.filter(
    (result) => result === null
  );

  assert.equal(
    allowed.length,
    1,
    "Exactly one request should succeed"
  );

  assert.equal(
    blocked.length,
    1,
    "The other request should be blocked"
  );

  const result = allowed[0];

  console.log("Concurrent reset requests correctly limited.");

  // Check the stored reset request.
  const stored = await prisma.passwordReset.findUnique({
    where: { userId: user.id },
  });

  assert.ok(stored, "Reset record should exist");
  assert.equal(stored.id, result.resetId);
  assert.equal(stored.attempts, 0);
  assert.equal(stored.sendCount, 1);
  assert.equal(stored.consumedAt, null);
  assert.match(stored.otpHash, /^[a-f0-9]{64}$/);
  assert.notEqual(stored.otpHash, result.otp);

  assert.equal(
    matchesPasswordResetOtp(
      result.resetId,
      user.id,
      result.otp,
      stored.otpHash
    ),
    true
  );

  assert.ok(
    stored.expiresAt.getTime() >=
      beforeRequest + 10 * 60 * 1000
  );

  assert.ok(
    stored.expiresAt.getTime() <=
      Date.now() + 10 * 60 * 1000
  );

  console.log("Password-reset storage checks passed.");

  // Immediate resend must not replace the existing request.
  const resend = await createPasswordReset({ email });

  assert.equal(resend, null);

  const afterResend = await prisma.passwordReset.findUnique({
    where: { userId: user.id },
  });

  assert.deepEqual(afterResend, stored);

  console.log("Immediate resend correctly blocked.");

  // Requesting a reset must not change the password.
  const unchangedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  assert.ok(unchangedUser);
  assert.equal(unchangedUser.password, passwordHash);

  const newPassword = `New-${randomUUID()}`;

  const wrongOtp =
    result.otp === "123456" ? "654321" : "123456";

  // Incorrect code must fail and increment the attempt count.
  const wrongResult = await resetPassword({
    resetId: result.resetId,
    otp: wrongOtp,
    newPassword,
  });

  assert.equal(wrongResult, false);

  const afterWrongCode = await prisma.passwordReset.findUnique({
    where: { userId: user.id },
  });

  assert.ok(afterWrongCode);
  assert.equal(afterWrongCode.attempts, 1);
  assert.equal(afterWrongCode.consumedAt, null);

  const userAfterWrongCode = await prisma.user.findUnique({
    where: { id: user.id },
  });

  assert.ok(userAfterWrongCode);
  assert.equal(userAfterWrongCode.password, passwordHash);

  console.log("Incorrect code counted; password unchanged.");

  // Submit the correct code twice simultaneously.
  const resetInput = {
    resetId: result.resetId,
    otp: result.otp,
    newPassword,
  };

  const resetResults = await Promise.allSettled([
    resetPassword(resetInput),
    resetPassword(resetInput),
  ]);

  const outcomes = resetResults.map((result) => {
    if (result.status === "rejected") {
      throw result.reason;
    }

    return result.value;
  });

  assert.equal(
    outcomes.filter((value) => value === true).length,
    1,
    "Exactly one password reset should succeed"
  );

  assert.equal(
    outcomes.filter((value) => value === false).length,
    1,
    "Concurrent code reuse should be rejected"
  );

  // The new password should work; the old one should not.
  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  assert.ok(updatedUser);
  assert.ok(updatedUser.password);

  assert.equal(
    await bcrypt.compare(newPassword, updatedUser.password),
    true
  );

  assert.equal(
    await bcrypt.compare(originalPassword, updatedUser.password),
    false
  );

  // The reset request must be consumed and its hash cleared.
  const consumedReset = await prisma.passwordReset.findUnique({
    where: { userId: user.id },
  });

  assert.ok(consumedReset);
  assert.ok(consumedReset.consumedAt instanceof Date);
  assert.equal(consumedReset.otpHash, "");

  console.log("Password updated; concurrent reuse blocked.");

  // A later attempt to reuse the code must also fail.
  const replayResult = await resetPassword({
    ...resetInput,
    newPassword: `Another-${randomUUID()}`,
  });

  assert.equal(replayResult, false);

  const userAfterReplay = await prisma.user.findUnique({
    where: { id: user.id },
  });

  assert.ok(userAfterReplay);
  assert.equal(userAfterReplay.password, updatedUser.password);

  console.log("Consumed reset code correctly rejected.");
  console.log("All password-reset database checks passed.");
}

main()
  .catch((error) => {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      if (testUserId) {
        // Cascade also removes this user's password-reset record.
        await prisma.user.delete({
          where: { id: testUserId },
        });

        console.log(
          "Temporary test user and reset record removed."
        );
      }
    } catch (error) {
      console.error("Cleanup failed:", error.message);
      process.exitCode = 1;
    } finally {
      await prisma.$disconnect();
    }
  });