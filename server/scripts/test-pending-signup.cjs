const path = require("node:path");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const prisma = require("../dist/lib/prisma").default;
const {
  createPendingSignup,
} = require("../dist/services/signup.service");
const {
  matchesSignupOtp,
} = require("../dist/lib/otp");

async function main() {
  const email = `otp-test-${randomUUID()}@example.com`;
  let signupId;

  try {
    const result = await createPendingSignup({
      name: "OTP Test",
      email,
      password: "Test-password-only-123!",
    });

    signupId = result.signupId;

    // An immediate second request must be rejected.
    await assert.rejects(
      () =>
        createPendingSignup({
          name: "OTP Test",
          email,
          password: "Test-password-only-123!",
        }),
      (error) => {
        assert.equal(error.name, "SignupRequestError");
        assert.equal(error.statusCode, 429);
      
        assert.ok(
          error.retryAfter > 0 && error.retryAfter <= 60,
          "The retry delay should be between 1 and 60 seconds"
        );
      
        return true;
      }
    );

    console.log("Immediate resend correctly blocked.");

    const pending = await prisma.pendingSignup.findUnique({
      where: { id: signupId },
    });
      
    assert.ok(pending, "Pending signup should exist");
    assert.equal(pending.email, email);
    assert.equal(pending.attempts, 0);
    assert.equal(pending.sendCount, 1);
    assert.equal(pending.id, result.signupId);
    assert.equal(pending.consumedAt, null);

    assert.equal(
      matchesSignupOtp(
        pending.id,
        pending.email,
        result.otp,
        pending.otpHash
      ),
      true,
      "Stored OTP hash should match the generated code"
    );

    const user = await prisma.user.findUnique({
      where: { email },
    });

    assert.equal(user, null, "A User should not exist yet");

    console.log("Pending signup database checks passed.");
  } finally {
    try {
      if (signupId) {
        await prisma.pendingSignup.delete({
          where: { id: signupId },
        });

        console.log("Temporary test record removed.");
      }
    } finally {
      await prisma.$disconnect();
    }
  }
}

main().catch((error) => {
  console.error("Test failed:", error.message);
  process.exitCode = 1;
});