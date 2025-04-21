import { useState, useEffect } from "react";
import { getAllTasks } from "../services/apiService";
import { TaskModel } from "../models/TaskModel";
import { ActivityModel, TaskStatusEnum } from "../models/ActivityModel";
import { formatDateForInput } from "../Helpers/App";
import WarningBox from "./WarningBox";

type ActivityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: ActivityModel, modalMode: string) => void;
  initialData?: ActivityModel;
  modalMode: "create" | "update";
  taskId?: number;
};

export default function ActivityModal({ isOpen, onClose, onSubmit, initialData, modalMode, taskId }: ActivityModalProps) {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.New);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(taskId);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks();
        setTasks(data);
        if (modalMode === "create" && taskId) {
          setSelectedTaskId(taskId);
        } else if (modalMode === "create" && data.length > 0) {
          setSelectedTaskId(data[0].taskId);
        }
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };
    fetchTasks();
  }, [modalMode, taskId]);

  const validateName = (name: string) => { //VALIDATION - name
    if (!name.trim()) {
      return "Name field is required.";
    }
    if (name.length < 2) {
      return "Name field must be at least 2 characters long.";
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return "Name field can only contain letters and numbers.";
    }
    return null;
  };

  useEffect(() => {
    if (initialData) { //UPDATE
      setDescription(initialData.description);
      setStartDate(initialData.startDate ? formatDateForInput(initialData.startDate) : undefined)
      setEndDate(initialData.endDate ? formatDateForInput(initialData.endDate) : undefined);
      setStatus(initialData.status);
      setSelectedTaskId(initialData.taskId);
      setName(initialData.name);
      setUrl(initialData.url ? initialData.url: ""); //canot be null becouse value on input
    } else { //CREATE
      setDescription("");
      setStartDate(undefined);
      setEndDate(undefined);
      setStatus(TaskStatusEnum.New);
      setUrl("");
      if (modalMode === "create" && taskId) {
        setSelectedTaskId(taskId);
      } else if (tasks.length > 0) {
        setSelectedTaskId(tasks[0].taskId);
      }
    }
  }, [initialData, isOpen, tasks, modalMode, taskId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTaskId) return;
      const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    const activityData: ActivityModel = {
      activityId: initialData?.activityId || Date.now(),
      description,
      startDate,
      endDate,
      status,
      taskId: selectedTaskId,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name,
      url,
    };
    onSubmit(activityData, modalMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 overflow-auto">
      <div className="bg-white p-6 rounded-lg w-[30rem] shadow-lg  mt-36">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{modalMode === "create" ? "Create Activity" : "Update Activity"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="Name of activity" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded invalid:border-pink-400 invalid:border-2 invalid:bg-pink-100" minLength={2} maxLength={25} required />
          
          <label>Description:</label>
          <textarea value={description} placeholder="Activity Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" maxLength={199}/>

          <label>Url:</label>
          <input type="text" placeholder="Url" value={url} onChange={(e) => setUrl(e.target.value)} className="border p-2 rounded" />

          <label>Start Date:</label>
          <input type="datetime-local" value={startDate || ""} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />

          <label>End Date:</label>
          <input type="datetime-local" value={endDate || ""} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />

          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className="border p-2 rounded">
            <option value={TaskStatusEnum.New}>New</option>
            <option value={TaskStatusEnum.InProgress}>In Progress</option>
            <option value={TaskStatusEnum.Done}>Done</option>
          </select>

          <label>Task association:</label>
          <select value={selectedTaskId || ""} onChange={(e) => setSelectedTaskId(Number(e.target.value))} className="border p-2 rounded" required>
            <option value="" disabled>Select a Task</option>
            {tasks.map(task => (
              <option key={task.taskId} value={task.taskId}>{task.name}</option>
            ))}
          </select>

          {error && <WarningBox name={error} /> }

          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">{modalMode === "create" ? "Create" : "Update"}</button>
        </form>
      </div>
    </div>
  );
}