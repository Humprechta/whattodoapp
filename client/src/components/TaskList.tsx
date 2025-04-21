import { TaskModel, TaskStatusEnum } from "../models/TaskModel";
import TaskModal from "./TaskModal";
import { createTask, updateTask } from "../services/apiService";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isTaskComplete } from "../Helpers/App";
import NotificationBox from "./NotificationBox";

// props
interface TaskListProps {
  taskList: TaskModel[]; // tasklist send field
  onDeleteTask: (index: number) => void; // return void, send integer
  refreshTasks: () => void;
}

export default function TaskList({ taskList, refreshTasks, onDeleteTask }: TaskListProps) {

    //const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");
    const [selectedTask, setSelectedTask] = useState<TaskModel | undefined>(undefined);

    const handleCreateClick = () => {
      setSelectedTask(undefined);
      setModalMode("create");
      setIsModalOpen(true);
    };
  
    const handleEditClick = (task: TaskModel) => {
      setSelectedTask(task);
      setModalMode("update");
      setIsModalOpen(true);
    };
  
    const handleSubmit = async (taskData: TaskModel) => {
      if (modalMode === "create") {
        await createTask(taskData);
        refreshTasks();
      } else {
        await updateTask(taskData);
        refreshTasks();
      }
      setIsModalOpen(false);
    };
  

  const getStatusColor = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.New:
        return "badge badge-info"; // Modrá
      case TaskStatusEnum.InProgress:
        return "badge badge-warning"; // Oranžová
      case TaskStatusEnum.Done:
        return "badge badge-success"; // Zelená
      default:
        return "badge";
    }
  };

  return (
    
    <div className="bg-base-100 p-5 rounded-xl shadow-md mt-5 w-full mx-auto">
    <ul className="space-y-3">
      <button className="btn btn-primary mb-4" onClick={handleCreateClick}>
        ➕ Create Task
      </button>

      {taskList.length > 0 ? (
        taskList.map((task) => (
          <li
            key={task.taskId}
            className="flex justify-between items-center bg-base-200 p-3 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <h4 className="font-bold">{task.name}</h4>
              <p className="text-sm pl-[0.2rem]">{task.content}</p>
              {task.status == TaskStatusEnum.Done ? <small>🕒 Last update: {new Date(task.updatedAt).toLocaleString()}</small> : <small>🕒 Created: {new Date(task.createdAt).toLocaleString()}</small>}
              <span className={`${getStatusColor(task.status)} mt-2`}>
                {TaskStatusEnum[task.status]}
              </span>
            </div>

            <div className="flex flex-wrap justify-end sm:flex-nowrap space-x-2 ml-auto">
            <Link
                to={`/tasks/${task.taskId}/activities`}
                className={`btn btn-sm btn-outline hover:bg-base-300 hover:text-black transition ${isTaskComplete(task) ? 'btn' : 'btn-error'}`}
                title={isTaskComplete(task) ? 'Activities' : '⚠️ At least one activity is not in "Done" status'}
              >
                📝 Activity
                {task.activities && task.activities?.length > 0 ? (
                  <span>+{task.activities.length}</span>
                ) : null}
              </Link>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleEditClick(task)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => onDeleteTask(task.taskId)}
              >
                ❌ Delete
              </button>
            </div>

          </li>
        ))
      ) : (
        <NotificationBox name="Task not found" />
      )}
    </ul>
    {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedTask}
          mode={modalMode}
        />
      )}
  </div>
  );
}