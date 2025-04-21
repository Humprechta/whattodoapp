import { Router } from "express";
import { getTasks, createTask, deleteTask, updateTask, getAllTAsks  } from "../controllers/taskController";

const router = Router();

// Def. GET route 
router.get("/tasks/", getTasks);
router.get("/tasks/getAll", getAllTAsks);

// POST for creating
router.post("/tasks/", createTask);
router.delete("/tasksDelete/:id", deleteTask); // DELETE request pro mazání úkolu
router.put("/tasksUpdate/:id", updateTask);

export default router;
