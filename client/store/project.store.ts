import { create } from "zustand";

import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/types/project.types";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/project.service";

type ProjectStore = {
  projects: Project[];

  currentProject: Project | null;

  loading: boolean;

  fetchProjects: () => Promise<void>;

  createProject: (
    data: CreateProjectInput
  ) => Promise<void>;

  updateProject: (
    id: string,
    data: UpdateProjectInput
  ) => Promise<void>;

  deleteProject: (
    id: string
  ) => Promise<void>;

  setCurrentProject: (
    project: Project | null
  ) => void;

  clearProjects: () => void;
};

export const useProjectStore =
create<ProjectStore>((set, get) => ({

  projects: [],

  currentProject: null,

  loading: false,

  fetchProjects: async () => {

    set({
      loading: true,
    });

    try {

      const projects =
        await getProjects();

      set({
        projects,
      });

    } catch (error) {

      console.error(error);

    } finally {

      set({
        loading: false,
      });

    }

  },

  createProject: async (data) => {

    try {

      const response =
        await createProject(data);

      set((state) => ({

        projects: [
          response.project,
          ...state.projects,
        ],

        currentProject: response.project,

      }));

    } catch (error) {

      console.error(error);

    }

  },

  updateProject: async (
    id,
    data
  ) => {

    try {

      const response =
        await updateProject(id, data);

      set((state) => ({

        projects: state.projects.map((project) =>

          project.id === id
            ? response.project
            : project

        ),

        currentProject:

          state.currentProject?.id === id
            ? response.project
            : state.currentProject,

      }));

    } catch (error) {

      console.error(error);

    }

  },

  deleteProject: async (id) => {

    try {

      await deleteProject(id);

      set((state) => ({

        projects:
          state.projects.filter(
            (project) => project.id !== id
          ),

        currentProject:

          state.currentProject?.id === id
            ? null
            : state.currentProject,

      }));

    } catch (error) {

      console.error(error);

    }

  },

  setCurrentProject: (project) =>

    set({
      currentProject: project,
    }),

  clearProjects: () =>

    set({

      projects: [],

      currentProject: null,

      loading: false,

    }),

}));