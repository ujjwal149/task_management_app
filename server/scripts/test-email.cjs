const path = require("node:path");

// Load server/.env, regardless of the terminal's current folder.
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.argv[2];

  if (!apiKey || !from || !to) {
    throw new Error(
      "RESEND_API_KEY, EMAIL_FROM, and a recipient email are required."
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "TaskFlow email test",
      text: "Your TaskFlow email configuration is working.",
    }),
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Request failed: ${response.status}`);
  }

  console.log("Resend accepted the email. Email ID:", result.id);
  console.log("Check your inbox and spam folder.");
}

main().catch((error) => {
  console.error("Email test failed:", error.message);
  process.exitCode = 1;
});