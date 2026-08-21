import api from "@/lib/axios"

import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectResponse,
} from "@/types/project.types";

import { TeamMember } from "@/types/team.type";


{/*Get Project Memeber*/}
export const getProjectMembers = async (
  projectId: string
) => {
  const response =
    await api.get<TeamMember[]>(
      `/projects/${projectId}/members`
    );

  return response.data;
};

{/*Get All Projects*/}
export const   getProjects = async() => {
    const response = await api.get<Project[]>("/projects");
    return response.data;
}

{/*Get  Project*/}
export const getProject = async(id:string)  => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
}

{/*Post Project*/}
export const createProject = async(data:CreateProjectInput) => {
    const response = await api.post<ProjectResponse>("/projects",data);
    return response.data;
}


{/*Update Project*/}
export const updateProject = async(
    id:string,
    data:UpdateProjectInput
) => {
        const response = await api.put<ProjectResponse>(`/projects/${id}`,data)
        return response.data;
};

{/*Delete Project*/}
export const deleteProject = async(
    id: string,
) => {
    const response = await api.delete<{message: string}>(`/projects/${id}`);
    return response.data;

};  