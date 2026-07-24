import api from "@/lib/axios";

export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

export const updateProfile = async (
  name: string
) => {
  const response = await api.patch(
    "/users/profile",
    {
      name,
    }
  );

  return response.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await api.patch(
    "/users/password",
    {
      currentPassword,
      newPassword,
    }
  );

  return response.data;
};

//Upload Avatar
export const uploadAvatar = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await api.patch(
    "/users/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};