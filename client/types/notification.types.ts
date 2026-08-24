export type NotificationType =
  | "PROJECT_INVITATION";

export type Notification = {
  id: string;

  type: NotificationType;

  message: string;

  data: {
    invitationId: string;
    
    projectId: string;
    projectName: string;

    invitedBy: {
      id: string;
      name: string;
    };

    role: string;
  };

  read: boolean;

  createdAt: string;
};  