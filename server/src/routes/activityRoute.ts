import { Router } from "express";
import { deleteActivityByID, updateActivity, createActivity } from "../controllers/activityController";
import { getTaskByID } from "../controllers/taskController";

const router = Router();

router.get("/tasks/:taskId/activities", getTaskByID);
router.delete("/activity/delete/:id", deleteActivityByID);
router.put("/activity/update", updateActivity)
router.post("/activity/create", createActivity);

export default router;