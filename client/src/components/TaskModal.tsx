import { useState, useEffect } from "react";
import { TaskModel, TaskStatusEnum } from "../models/TaskModel";
import { formatDateForInput, isTaskComplete } from "../Helpers/App";
import NotificationBox from "./NotificationBox";
import WarningBox from "./WarningBox";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskModel) => void;
  initialData?: TaskModel;
  mode: "create" | "update";
};

export default function TaskModal({ isOpen, onClose, onSubmit, initialData, mode }: TaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.New);
  const [showWarning, setShowWarning] = useState(false); // Stavy pro zobrazení upozornění
  const [task, setTask] = useState<TaskModel | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
        //update
      setTaskName(initialData.name);
      setTaskContent(initialData.content);
      setStartDate(initialData.startDate ? formatDateForInput(initialData.startDate) : undefined)
      setEndDate(initialData.endDate ? formatDateForInput(initialData.endDate) : undefined);
      setStatus(initialData.status);
      setTask(initialData);
      setWarning(initialData);
    } else {
      setTaskName("");
      setTaskContent("");
      setStartDate(undefined);
      setEndDate(undefined);
      setStatus(TaskStatusEnum.New);
      setTask(undefined);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateName(taskName);
    if (validationError) {
      setError(validationError);
      return;
    }
    const taskData: TaskModel = {
      taskId: initialData?.taskId || Date.now(),
      name: taskName,
      content: taskContent,
      startDate,
      endDate,
      status,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(taskData);
  };

  const validateName = (name: string) => { //VALIDATION - name
    if (!name.trim()) {
      return "Name field is required.";
    }
    if (name.length < 2) {
      return "Name field must be at least 2 characters long.";
    }
    /*if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return "Name field can only contain letters and numbers.";
    }*/
    return null;
  };

  const setWarning = (task : TaskModel | undefined) =>{
    console.log(status);
    if(isTaskComplete(task, false)){
      setShowWarning(false); // Nastavení showWarning na true při změně statusu
    }else{
      setShowWarning(true);
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = Number(e.target.value);
    setStatus(newStatus);
    setWarning(task);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 overflow-auto">
      <div className="bg-white p-6 rounded-lg w-[30rem] shadow-lg  mt-36">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{mode === "create" ? "Create Task" : "Update Task"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="border p-2 roundedinvalid:border-pink-400 invalid:border-2 invalid:bg-pink-100" minLength={2} maxLength={25} required />

          <label>Description:</label>
          <textarea placeholder="Description" value={taskContent} onChange={(e) => setTaskContent(e.target.value)} className="border p-2 rounded" maxLength={29} />

          <label>Start Date:</label>
          <input type="datetime-local" value={startDate || ""} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />

          <label>End Date:</label>
          <input type="datetime-local" value={endDate || ""} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />

          <label>Status:</label>
          <select value={status} onChange={(e) => handleStatusChange(e)} className="border p-2 rounded">
            <option value={TaskStatusEnum.New}>New</option>
            <option value={TaskStatusEnum.InProgress}>In Progress</option>
            <option value={TaskStatusEnum.Done}>Done</option>
          </select>

          {error && <WarningBox name={error} /> }
           {/* Upozornění pro uživatele, pokud task není kompletní a status je Done */}
           {showWarning && status === TaskStatusEnum.Done && (
            <NotificationBox mssg={'At least one activity is not in "Done" status. Please complete all activities before setting the task to "Done"'} />
          )}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{mode === "create" ? "Create" : "Update"}</button>
        </form>
      </div>
    </div>
  );
}
