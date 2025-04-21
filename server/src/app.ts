import express from "express";
import cors from "cors";
import taskRoute from "./routes/taskRoute"; // Import routy
//import dotenv from 'dotenv';
import activityRoute from "./routes/activityRoute"
import { connectWithRetry } from './config/db';
const app = express();

//const PORT = process.env.PORT;
//const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
//app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Spuštění serveru
/*app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});*/

// Připojení k databázi
connectWithRetry();

// Nastavení CORS
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
  })
);

// Přidání rout
app.use("/api", taskRoute);
app.use("/api", activityRoute);

// Export aplikace
export default app;
