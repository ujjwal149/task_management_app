import api from "@/lib/axios";

export const acceptInvitation = async (
  invitationId: string
) => {
  const response = await api.post(
    `/invitations/${invitationId}/accept`
  );

  return response.data;
};


export const rejectInvitation = async (
  invitationId: string
) => {
  const response = await api.post(
    `/invitations/${invitationId}/reject`
  );

  return response.data;
};