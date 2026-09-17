
type SendEmailOptions = {
    to: string;
    subject: string; 
    text: string; 
};

export async function sendEmail({
    to,
    subject,
    text,
}: SendEmailOptions): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
        throw new Error("Email configuration is missing.");
    }

    const response = await fetch("https://api.resend.com/emails",{
        method: "POST",
        headers: {Authorization: `Bearer ${apiKey}`,"Content-Type": "application/json",},
        body: JSON.stringify({
            from,
            to: [to],
            subject,
            text,
        }),
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        throw new Error(`Email sending failed (${response.status}).`);
    }
}