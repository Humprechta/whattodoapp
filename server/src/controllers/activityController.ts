import { Request, Response } from 'express';
import ActivityModel from '../models/ActivityModel';

export const getActivitiesByTaskId = async (req: Request, res: Response) => {//depricated
  const { taskId } = req.params; 
  try {
    const activities = await ActivityModel.findAll({
      where: { taskId: Number(taskId) },
    });
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteActivityByID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;//id of Task
    console.log(id);
    const task = await ActivityModel.findByPk(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    await task.destroy(); //delete
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    //const { id } = req.params;
    const { description, startDate, endDate, status, taskId, activityId, name, url } = req.body;

    const validation = validateActivity(name, description);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const activity = await ActivityModel.findByPk(activityId);
    if (!activity) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    activity.taskId = taskId;
    activity.description = description;
    activity.startDate = startDate;
    activity.endDate = endDate;
    activity.status = status;
    activity.name = name;
    activity.url = url;
    await activity.save();

    res.status(200).json({ message: "Activity updated." });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { description, startDate, endDate, status, taskId, name, url } = req.body;

    const validation = validateActivity(name, description);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    // create new task
    const newActivity = await ActivityModel.create({
      taskId,
      description,
      startDate,
      endDate,
      status,
      name,
      url
    });

    res.status(201).json({ message: "Activity created." }); //  send 201 = everything ok
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" }); //sedn errs
  }
};

const validateActivity = (name: string, description?: string): { isValid: boolean; message?: string } => {
  if (!name || name.length < 2 || name.length > 25) {
    return { isValid: false, message: "Name must be between 2 and 29 characters." };
  }

  if (description && description.length > 199) {
    return { isValid: false, message: "Description cannot exceed 999 characters." };
  }

  return { isValid: true };
};