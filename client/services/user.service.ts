import api from "@/lib/axios";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserRole = async (
  userId: string,
  role: "ADMIN" | "USER"
) => {
  const response = await api.patch(
    `/users/${userId}/role`,
    { role }
  );

  return response.data;
};

export const deleteUser = async (
  userId: string
) => {
  const response = await api.delete(
    `/users/${userId}`
  );

  return response.data;
};