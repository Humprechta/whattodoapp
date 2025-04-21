import { Request, Response } from "express";
import TaskModel from '../models/taskModel';
import ActivityModel from '../models/ActivityModel';
import { Op } from "sequelize";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { name, status, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "DESC" } = req.query;

    const whereClause: any = {};

    if (typeof name === "string" && name.length >= 2) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    if (typeof status === "string") {
      whereClause.status = Number(status);
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const offset = (pageNumber - 1) * limitNumber;

    // Mapování sortBy na správné sloupce
    const validSortFields = ["name", "createdAt", "status"];
    const orderColumn = validSortFields.includes(sortBy as string) ? (sortBy as string) : "createdAt";
    const orderDirection = sortOrder === "asc" ? "ASC" : "DESC";

    const { rows: tasks, count } = await TaskModel.findAndCountAll({
      include: [
        {
          model: ActivityModel,
          as: "activities",
        },
      ],
      where: whereClause,
      limit: limitNumber,
      offset,
      order: [[orderColumn, orderDirection]],
    });
    
    const delay = 200; // 0,2s delay

    setTimeout(() => {
      console.log("✅ Sending data to Client");
      res.status(200).json({
        tasks,
        totalPages: Math.ceil(count / limitNumber),
        currentPage: pageNumber,
        totalTasks: count,
      });
    }, delay);

    
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};




/*export const getTasks = async (req: Request, res: Response) => {
  const { name } = req.query; // Použijeme query parametry
  console.log("Hledaný název:", name);

  try {
    // Dynamicky nastavíme podmínku where
    const whereClause = name
      ? {
          name: {
            [Op.like]: `%${name}%`, // Používáme LIKE pro částečné vyhledávání
          },
        }
      : {}; // Pokud name není zadaný, vrátíme všechny úkoly

    const tasks = await TaskModel.findAll({
      where: whereClause,
      include: [
        {
          model: ActivityModel,
          as: "activities",
        },
      ],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};*/

export const getAllTAsks = async (req: Request, res: Response) => {

  try {

    const tasks = await TaskModel.findAll({
      include: [
        {
          model: ActivityModel,
          as: "activities",
        },
      ],
    });

    res.status(200).json(
      tasks,
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, content, startDate, endDate, status } = req.body;

    const validation = validateActivity(name, content);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    // create new task
    const newTask = await TaskModel.create({
      name,
      content,
      startDate,
      endDate,
      status,
    });

    res.status(201).json(newTask); //  send 201 = everything ok
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" }); //sedn errs
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, content, startDate, endDate, status } = req.body;

    const validation = validateActivity(name, content);
    if (!validation.isValid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    const task = await TaskModel.findByPk(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    task.name = name;
    task.content = content;
    task.startDate = startDate;
    task.endDate = endDate;
    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const task = await TaskModel.findByPk(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

/**
 * Get Task with sub Activities
 * @param req 
 * @param res 
 */
export const getTaskByID = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  console.log(taskId);
  try {
     const tasks = await TaskModel.findOne({
      include: [{
        model: ActivityModel,
        as: 'activities',
      }],
      order: [["createdAt", "DESC"]],
      where: { taskId: Number(taskId) }
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
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