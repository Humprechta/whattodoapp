import axios, { AxiosError, AxiosResponse } from "axios";
import { TaskModel } from "../models/TaskModel";
import { ActivityModel, TaskStatusEnum } from "../models/ActivityModel";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Backend API URL
  timeout: 5000, // Timeout 5 sekund
});
/**
 * ----------------------TASKS----------------------
 */
export async function getTasks(
  searchTerm: string | null = null,
  status: TaskStatusEnum | null = null,
  page: number = 1,
  limit: number = 10,
  sortBy: string | null = null,
  sortOrder: "asc" | "desc" | null = null,
  signal?: AbortSignal
) {
  try {
    const queryParams = new URLSearchParams();

    if (searchTerm && searchTerm.length >= 2) {
      queryParams.append("name", searchTerm);
    }

    if (status !== null) {
      queryParams.append("status", status.toString());
    }

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (sortBy) {
      queryParams.append("sortBy", sortBy);
    }
    
    if (sortOrder) {
      queryParams.append("sortOrder", sortOrder);
    }
    console.log(`/tasks?${queryParams.toString()}`);
    const response: AxiosResponse<{ tasks: TaskModel[]; totalPages: number; currentPage: number; totalTasks: number }> =
      await apiClient.get(`/tasks?${queryParams.toString()}`, { signal });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error fetching tasks: ${err.response?.data || err.message}`);
  }
}

export const getAllTasks = async () => {
  try {
    const response: AxiosResponse<TaskModel[]> = await apiClient.get(`/tasks/getAll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};
//POST
export async function deleteTask(taskId: number) {
  try {
    await apiClient.delete("/tasksDelete/" + taskId);
    return true; // return response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating task: ${err.response?.data || err.message}`);
  }
}

export async function updateTask(taskData: TaskModel) {
  try {
    const response: AxiosResponse = await apiClient.put(`/tasksUpdate/${taskData.taskId}`, taskData)
    return response.data; // return response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating task: ${err.response?.data || err.message}`);
  }
}

export async function createTask(taskData: TaskModel) {
  try {
    const response: AxiosResponse = await apiClient.post("/tasks", taskData); //POST!!
    return response.data; // return response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating task: ${err.response?.data || err.message}`);
  }
}

/**
 * ----------------------Activity----------------------
 */
//GET
export const getActivitiesByTaskId = async (taskId :number) => {
  try {
    //console.log(`/tasks/${taskId}/activities`);
    const response: AxiosResponse<TaskModel> = await apiClient.get(`/tasks/${taskId}/activities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

//POST
export async function createActivity(editActivity: ActivityModel) { //update or create
  try {
    const response: AxiosResponse = await apiClient.post(`/activity/create`, editActivity)
    return response.data; // return response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating task: ${err.response?.data || err.message}`);
  }
}
export async function updateActivity(activity: ActivityModel) {
  try {
    const response: AxiosResponse = await apiClient.put(`/activity/update`, activity)
    return response.data; // return response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating task: ${err.response?.data || err.message}`);
  }
}
export async function deleteActivity(activity: number) {
  try {
    await apiClient.delete("/activity/delete/" + activity);
    return true; // return response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating task: ${err.response?.data || err.message}`);
  }
}
