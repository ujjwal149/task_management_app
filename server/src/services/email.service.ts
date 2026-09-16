export async function sendOtpEmail(email: string, code: string, purpose: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Email delivery is not configured");
  const action = purpose === "SIGNUP" ? "verify your email" :
    purpose === "LOGIN" ? "sign in" : "reset your password";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "User-Agent": "TaskFlow/1.0" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Your TaskFlow ${action} code`,
      text: `Your code to ${action} is ${code}. It expires in 10 minutes and can only be used once. If you did not request it, you can ignore this email. Never share this code.`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email delivery failed");
}
