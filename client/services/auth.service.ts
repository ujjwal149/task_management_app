import api from "@/lib/axios";

export const signin = async (
    data:{
        email: string;
        password: string;
}) => {
    const response = await api.post("/auth/signin",data);

    return response.data;
}

export const signup = async (
    data:{
        name: string;
        email: string;
        password: string;
    }) => {
        const response = await api.post("/auth/signup",data);

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