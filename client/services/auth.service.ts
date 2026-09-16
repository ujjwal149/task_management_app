import api from "@/lib/axios";

export type SignupData = { name: string; email: string; password: string };
export type OtpChallenge = { challengeId: string; message: string; expiresIn: number; retryAfter: number };
export type OtpVerification = { email: string; challengeId: string; code: string };
export const signin = async (data: { email: string; password: string }) =>
  (await api.post("/auth/signin", data)).data;
export const signup = async (data: SignupData): Promise<OtpChallenge> =>
  (await api.post("/auth/signup", data)).data;
export const verifySignup = async (data: OtpVerification) =>
  (await api.post("/auth/signup/verify", data)).data;
export const requestLoginOtp = async (email: string): Promise<OtpChallenge> =>
  (await api.post("/auth/otp/request", { email })).data;
export const verifyLoginOtp = async (data: OtpVerification) =>
  (await api.post("/auth/otp/verify", data)).data;
export const forgotPassword = async (email: string): Promise<OtpChallenge> =>
  (await api.post("/auth/forgot-password", { email })).data;
export const resetPassword = async (data: OtpVerification & { password: string }) =>
  (await api.post("/auth/reset-password", data)).data;
export const logout = async () => (await api.post("/auth/logout")).data;
export const me = async () => (await api.get("/auth/me")).data;
