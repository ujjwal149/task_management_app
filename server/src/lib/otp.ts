import {
    randomInt,
    createHmac,
    timingSafeEqual,
} from "node:crypto";

//Generate a Six-digits code , keeping leading zeros.
export function generateOtp(): string{
    return randomInt(0,1_000_000)
           .toString()
           .padStart(6,"0");
}

//Protect  a code and bind it to a specific signup request .
export function hashSignupOtp(
    signupId: string,
    email: string,
    otp: string
): string{
    const secret = process.env.OTP_SECRET;

    if (!secret || secret.length < 32 ){
        throw new Error(    
            "OTP_SECRET must contian at least 32 characters."
        );
    }

    const data = JSON. stringify([
        "signup",
        signupId,
        email,
        otp,
    ]);

    return createHmac("sha256",secret)
        .update(data)
        .digest("hex");
}

//Compare a submitted code against the stored protected value.
export function matchesSignupOtp(
    signupId: string,
    email: string,
    otp: string,
    storedHash: string
): boolean {
    if (!/^\d{6}$/.test(otp)) {
    return false;
  }

  if (!/^[a-f0-9]{64}$/.test(storedHash)) {
    return false;
  }

  const submittedHash = hashSignupOtp(signupId, email, otp);

  return timingSafeEqual(
    Buffer.from(submittedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

//Password Reset
export function hashPasswordResetOtp(
    resetId: string,
    userId: string,
    otp: string
): string {
    const secret = process.env.OTP_SECRET;

    if(!secret || secret.length < 32){
        throw new Error (
            "OTP_SECRET must contain at least 32 characters."
        );
    }

    const data = JSON.stringify([
        "password-reset",
        resetId,
        userId,
        otp,
    ]);

    return createHmac("sha256", secret)
            .update(data)
            .digest("hex");
        
};

export function matchesPasswordResetOtp(
    resetId: string,
    userId: string,
    otp: string,
    storedHash: string
): boolean {

    if (!/^\d{6}$/.test(otp)) {
    return false;
  }

  if (!/^[a-f0-9]{64}$/.test(storedHash)) {
    return false;
  }

  const submittedHash = hashPasswordResetOtp(
    resetId,
    userId,
    otp
  );

  return timingSafeEqual(
    Buffer.from(submittedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}