import TaskChart from "../components/TaskChart";
import { getAllTasks } from "../services/apiService";
import { useEffect, useState } from "react";
import { TaskModel } from "../models/TaskModel";

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const tasksData = await getAllTasks();
    console.log(tasksData);
    setTasks(tasksData);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📌 WhatToDoApp</h1>
      <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
      <h2 className="text-2xl font-bold mb-4">📝 Dashboard</h2>
      <TaskChart tasks={tasks} />
    </div>
  );
}
