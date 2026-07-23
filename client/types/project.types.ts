export type Project = {
    id: string;

    name: string;

    description: string | null;

    color: string | null;

    creatorId: string;

    createdAt: string;

    updatedAt: string;

    _count: {

        tasks: number;

    };
};

export type CreateProjectInput = {
    name : string;

    description?: string; 
}

export type UpdateProjectInput = {
    name: string;
    description?: string;
    color?: string;
}

export type ProjectResponse = {
    message: string,
    project: Project
}
