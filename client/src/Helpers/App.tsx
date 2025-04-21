import { TaskModel, TaskStatusEnum } from "../models/TaskModel";

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

const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    const pad = (num: number) => (num < 10 ? '0' + num : num);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

function isTaskComplete(task: TaskModel | undefined, checkTAskSTatus: boolean = true): boolean {
  // Zkontrolujeme, zda je task ve stavu DONE
  if(!task){
    return true;
  }
  if(checkTAskSTatus){
    if (task.status !== TaskStatusEnum.Done) {
      return true;
    }
  }
  // Pokud task má aktivity
  if (task.activities && task.activities.length > 0) {
    // Zkontrolujeme, zda všechny aktivity jsou ve stavu DONE
    const allActivitiesDone = task.activities.every(activity => activity.status === TaskStatusEnum.Done);
    return allActivitiesDone;
  }

  // Pokud task nemá žádné aktivity, považujeme ho za hotový
  return true;
}

export { getStatusColor, formatDateForInput, isTaskComplete }