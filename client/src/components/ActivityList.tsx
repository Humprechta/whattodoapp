import { useState } from "react";
import { TaskModel } from "../models/TaskModel";
import { ActivityModel, TaskStatusEnum } from "../models/ActivityModel";
import ActivityModal from "./ActivityModal";
import {getStatusColor} from "../Helpers/App";
import NotificationBox from "./NotificationBox";

interface ActivityListPorops {
    task: TaskModel; // tasklist send field
    handleSubmit: (activity: ActivityModel, modalMode: string) => void; // return void, send integer
    handleDeleteActivity: (activityId: number) => void;
}

export default function TaskList({ task, handleSubmit, handleDeleteActivity}: ActivityListPorops) {

    const [selectedActivity, setSelectedActivity] = useState<ActivityModel | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "update">("create");
    const formatDate = (date: string) => new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

    const handleCreateClick = () => {
        setSelectedActivity(undefined);
        setModalMode("create");
        setIsModalOpen(true);
      };
    
      const handleEditClick = (activity: ActivityModel) => {
        setSelectedActivity(activity);
        setModalMode("update");
        setIsModalOpen(true);
      };
    
    return(
        <div>
            <button className="btn btn-primary mb-4" onClick={handleCreateClick}>➕ Create Activity</button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {task && task.activities && task.activities.length > 0 ? (
                task.activities.map((activity) => (
                    <div key={activity.activityId} className="card bg-base-100 shadow-lg border border-gray-200 p-4 max-w-sm">
                        <div className="card-body space-y-2">
                            <h2 className="card-title text-lg font-semibold text-primary">{activity.name}</h2>
                            <p className="text-gray-700 line-clamp-3">{activity.description}</p>

                            <div className="text-sm text-gray-500 space-y-1">
                                <div className="text-sm text-gray-500 space-y-1 flex justify-between items-center">
                                    <span className={getStatusColor(activity.status)}>
                                        {TaskStatusEnum[activity.status]}
                                    </span>
                                    {activity.url && (
                                        <a
                                            href={"https://" + activity.url}
                                            target="_blank"
                                            title={"https://" + activity.url}
                                            className="text-blue-500 hover:text-blue-800"
                                        >
                                        Link&#10138;
                                        </a>
                                    )}
                            </div>
                            {activity.startDate && <p>🕒 Start: {formatDate(activity.startDate)}</p>}
                            {activity.endDate && <p>🏁 End: {formatDate(activity.endDate)}</p>}
                            </div>

                            <div className="text-xs text-gray-400">
                            <p>📅 Created: {formatDate(activity.createdAt)}</p>
                            <p>📝 Updated: {formatDate(activity.updatedAt)}</p>
                            </div>

                            <div className="flex gap-2">
                            <button className="btn btn-sm btn-warning flex-1" onClick={() => handleEditClick(activity)}>
                                ✏️ Edit
                            </button>
                            <button className="btn btn-sm btn-error flex-1" onClick={() => handleDeleteActivity(activity.activityId)}>
                                ❌ Delete
                            </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
            <NotificationBox name="0 Activities were found." />
            )}
            </div>

                {isModalOpen && (
                    <ActivityModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        initialData={selectedActivity}
                        modalMode={modalMode}
                        taskId={task.taskId} //for create and update wee need taskId
                    />
                )}
            
        </div>
    )

}