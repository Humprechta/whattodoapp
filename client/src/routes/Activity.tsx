import { useEffect, useState } from "react";
import { getActivitiesByTaskId, deleteActivity, createActivity, updateActivity } from "../services/apiService";
import { ActivityModel, TaskStatusEnum } from "../models/ActivityModel";
import { useParams } from 'react-router-dom';
import { TaskModel } from "../models/TaskModel";
import { toast, ToastContainer } from "react-toastify"; // Import knihovny pro notifikace
import ActivityList from "../components/ActivityList";
import ConfirmModal from "../components/ConfirmModal";
import NotificationBox from "../components/NotificationBox";
import WarningBox from "../components/WarningBox";

function ActivitiesList() {
    const { id } = useParams(); // Získání taskId z URL
    const [task, setTask] = useState<TaskModel>({
      taskId: 0,
      name: "",
      content: "",
      createdAt: "",
      updatedAt: "",
      status: TaskStatusEnum.New, // Nebo jiný výchozí stav
      activities: []
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onConfirm, setOnConfirm] = useState<((result: boolean) => void) | null>(null);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);

  const loadData = async () =>{
    setError(null);
    try{
      const data = await getActivitiesByTaskId(Number(id));
      console.log(Number(id));
      console.log(data);
      setTask(data);
    }catch(e){
      setError("Error with fetching data...");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchActivities = async () => {
      loadData();
    };
    fetchActivities();
  }, []);

  const handleSubmit = async (activityData: ActivityModel, modalMode: string) => {
    //event.preventDefault(); // Zabráníme defaultnímu chování formuláře (reload stránky)
    setLoading(true);
    try {
        if (modalMode === "create") {
          await createActivity(activityData);
          loadData();
        } else {
          await updateActivity(activityData);
          loadData();
        }
          //setIsModalOpen(false);
        } catch (error) {
          if (modalMode === "create") {
            setError("Error creating activity. Please try again.");
          }
          setError("Error editing activity. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      const showConfirm = (): Promise<boolean> => {
        return new Promise((resolve) => {
          setVisibleConfirm(true);
          setOnConfirm(() => (result: boolean) => {
            setVisibleConfirm(false);
            resolve(result);
          });
        });
      };

  const handleDeleteActivity = async (activity: number) => {

    try {
      const confirmed = await showConfirm();
      if (!confirmed) return;
      await deleteActivity(activity); // Zavolání API pro mazání
      //setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId)); 
      toast.success("✅ Activity deleted successfully!");
      const data = await getActivitiesByTaskId(Number(id));
      setTask(data);
    } catch (error) {
      setError("Error deleting task. Please try again.");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-center">Activities List for: <i>{task.name}</i></h1>
      <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
      <ToastContainer aria-label="Notification container" />
      {error ? (
        <>
        <WarningBox err={error}/>
        </>
      ) : (
        <>
        {loading ? (
          <NotificationBox mssg={"Loading ..."} />
        ) : (
          <>
            <ActivityList task={task} handleSubmit={handleSubmit} handleDeleteActivity={handleDeleteActivity} />
            <ConfirmModal message={"Are you sure to delete this activity?"} onConfirm={onConfirm!} visible={visibleConfirm} />
          </>
          )}
        </>
      )}
    </div>
  );
}

export default ActivitiesList;