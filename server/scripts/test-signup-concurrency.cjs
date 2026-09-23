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

async function main() {
  const email = `concurrency-test-${randomUUID()}@example.com`;

  const input = {
    name: "Concurrency Test",
    email,
    password: "Test-password-only-123!",
  };

  try {
    const results = await Promise.allSettled([
      createPendingSignup(input),
      createPendingSignup(input),
    ]);

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    );

    const rejected = results.filter(
      (result) => result.status === "rejected"
    );

    assert.equal(successful.length, 1);
    assert.equal(rejected.length, 1);

    assert.equal(
      rejected[0].reason.name,
      "SignupRequestError"
    );
    assert.equal(rejected[0].reason.statusCode, 429);

    const pending = await prisma.pendingSignup.findUnique({
      where: { email },
    });

    assert.ok(pending);
    assert.equal(pending.sendCount, 1);
    assert.equal(
      pending.id,
      successful[0].value.signupId
    );

    console.log("Concurrent signup checks passed.");
  } finally {
    try {
      await prisma.pendingSignup.deleteMany({
        where: { email },
      });

      console.log("Temporary test record removed.");
    } finally {
      await prisma.$disconnect();
    }
  }
}

main().catch((error) => {
  console.error("Test failed:", error.message);
  process.exitCode = 1;
});