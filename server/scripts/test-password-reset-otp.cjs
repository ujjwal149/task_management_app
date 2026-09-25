const assert = require("node:assert/strict");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const {
  hashSignupOtp,
  hashPasswordResetOtp,
  matchesPasswordResetOtp,
} = require("../dist/lib/otp");

const resetId = randomUUID();
const userId = randomUUID();

// Fixed code tests leading-zero handling reliably.
const otp = "048231";
const storedHash = hashPasswordResetOtp(resetId, userId, otp);

assert.match(storedHash, /^[a-f0-9]{64}$/);

// Correct request, user, and code.
assert.equal(
  matchesPasswordResetOtp(resetId, userId, otp, storedHash),
  true
);

// Wrong code.
assert.equal(
  matchesPasswordResetOtp(resetId, userId, "048232", storedHash),
  false
);

// Different reset request.
assert.equal(
  matchesPasswordResetOtp(randomUUID(), userId, otp, storedHash),
  false
);

// Different user.
assert.equal(
  matchesPasswordResetOtp(resetId, randomUUID(), otp, storedHash),
  false
);

// Even with identical other inputs, a signup hash must not work.
const signupHash = hashSignupOtp(resetId, userId, otp);

assert.equal(
  matchesPasswordResetOtp(resetId, userId, otp, signupHash),
  false
);

// Invalid formats.
for (const invalidOtp of ["", "48231", "0482310", "04a231"]) {
  assert.equal(
    matchesPasswordResetOtp(resetId, userId, invalidOtp, storedHash),
    false
  );
}

assert.equal(
  matchesPasswordResetOtp(resetId, userId, otp, "invalid-hash"),
  false
);

console.log("All password-reset OTP helper checks passed.");