import { sequelize } from "../config/db";
import TaskModel from "../models/taskModel";
import ActivityModel from "../models/ActivityModel";

(async () => {
  try {
    console.log("🔄 Starting database synchronization...");
    await TaskModel.sync({ alter: true }); // Synchronizace DB
    await ActivityModel.sync({ alter: true });
    console.log("✅ Database synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
    process.exit(1);
  }
})();