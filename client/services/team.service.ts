import api from "@/lib/axios";

export const getProjectMembers = async (
  projectId: string
) => {
  const response = await api.get(
    `/team/${projectId}`
  );

  return response.data;
};

export const inviteMember = async (
  email: string,
  role: "ADMIN" | "USER",
  projectId: string
) => {
  const response = await api.post(
    "/team/invite",
    {
      email,
      role,
      projectId,
    }
  );

  return response.data;
};

export const removeMember = async (
  memberId: string
) => {
  const response = await api.delete(
    `/team/${memberId}`
  );

  return response.data;
};