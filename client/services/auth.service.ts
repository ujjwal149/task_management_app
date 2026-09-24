import api from "@/lib/axios";


//---------------- Signin --------------------------//
export const signin = async (
    data:{
        email: string;
        password: string;
}) => {
    const response = await api.post("/auth/signin",data);

    return response.data;
}

//--------------Signup -------------------------------//
export const signup = async (
    data:{
        name: string;
        email: string;
        password: string;
    }) => {
        const response = await api.post("/auth/signup",data);

        return response.data;
    };

//---------------Verify signup --------------//
export type VerifySignupData = {
  signupId: string;
  email: string;
  otp: string;
};

export const verifySignup = async (data: VerifySignupData) => {
  const response = await api.post("/auth/signup/verify", data);

  return response.data;
};

export const logout = async () => {
        const response = await api.post("/auth/logout");

        return response.data;
    }

export const me = async() => {
        const response = await api.get("/auth/me")
        return response.data;
    }

//--------------- Forgot Password ------------------//
export type ForgotPasswordData = {
    email: string;
};

export type ForgotPasswordResponse = {
    resetId: string;
    message: string;
};

export const forgotPassword = async (
    data: ForgotPasswordData
): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        data
    )

    return response.data
}

//----------------- Reset Password -----------------------//
export type ResetPasswordData = {
    resetId: string;
    otp: string;
    newPassword: string;
}

export type ResetPasswordResponse = {
    message: string;
}

export const resetPassword = async (
    data: ResetPasswordData
): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(
        "auth/reset-password",
        data
    );

    return response.data;
}