export type TeamMember = {
  id: string;         

  role: "ADMIN" | "USER";

  user: {
    id: string;

    name: string;

    email: string;

    avatar?: string | null;
  };
};