import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects, getProjectById } from "../actions";


export type ActionError = {
    error: string;
};

function isActionError(value: unknown): value is ActionError {
    return (
        typeof value === "object" &&
        value !== null &&
        "error" in value &&
        typeof (value as ActionError).error === "string"
    );
}

// This function is used to unwrap the action result. If the result is an error, it throws an error. If the result is a success, it returns the result.
async function unwrapActionResult<T>(result: T | { error: string }): Promise<T> {
    if (isActionError(result)) {
        throw new Error(result.error);
    }

    return result;
}

// Create Project Hook
export const useCreateProject = () => {
    const queryClient = useQueryClient(); // QueryClient is a hook that provides a query client instance This gives you access to TanStack Query's query manager.

    //* UseMutation means -> change/write data on the server -> createProject accepts some value so we have to send like this 
    return useMutation({
        mutationFn: async (value: string) =>
            unwrapActionResult(await createProject(value)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] }); // The projects data has potentially changed. The cached projects data is now stale. 
        }
    })
}

//TODO: get a toast notification when the project is created

export const useGetProjects = () => {
    //* UseQuery means -> get/read data from the server
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => unwrapActionResult(await getProjects()),
    })
}

export const useGetProjectById = (id: string) => {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => unwrapActionResult(await getProjectById(id)),
    })
}