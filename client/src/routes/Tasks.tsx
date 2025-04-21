import { useEffect, useRef, useState } from "react";
import TaskList from "../components/TaskList";
import { getTasks, deleteTask } from "../services/apiService";
import { TaskModel, TaskStatusEnum  } from "../models/TaskModel";
import { toast } from "react-toastify"; // Import knihovny pro notifikace
import "react-toastify/dist/ReactToastify.css"; // Styl pro notifikace
import { ToastContainer } from "react-toastify";
import SearchMenu from "../components/SearchMenu";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import WarningBox from "../components/WarningBox";
import NotificationBox from "../components/NotificationBox";

export function confirmationOfDelation(){

}

export default function Tasks() {
  const [filteredTasks, setFilteredTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearch] = useState<string | null>("");
  const [statusSearch, setStatus] = useState<TaskStatusEnum | null>(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [onConfirm, setOnConfirm] = useState<((result: boolean) => void) | null>(null);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3; // task per page

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const handler = setTimeout(() => {
      getTasks(searchTerm, statusSearch, page, pageSize, sortBy, sortOrder, controller.signal)
        .then((data) => {
          setFilteredTasks(data.tasks);
          setTotalPages(data.totalPages);
          setPage(data.currentPage);
          setError(null);
        })
        .catch((error) => {
          console.log(error);
          if (error.message !== "Error fetching tasks: canceled") {
            setError(error.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 100); // Debounce delay 100ms
    return () => {
      clearTimeout(handler); // Clears the debounce timeout
      controller.abort(); // Cancels the fetch request
    };
  }, [searchTerm, statusSearch, page, sortBy, sortOrder]);
  
  const handleFilterChange = ({ searchTerm, sortBy, sortOrder, status }: { 
    searchTerm: string; 
    sortBy: string; 
    sortOrder: "asc" | "desc"; 
    status: TaskStatusEnum | null 
  }) => {
    if(searchTerm.length == 1){
      return;
    }
    setStatus(status);
    setPage(1);
    setSearch(searchTerm);
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  const handleDeleteTask = async (taskId: number) => {
    const confirmed = await showConfirm();
    if (!confirmed) return;
    try {
      await deleteTask(taskId);
      toast.success("✅ Activity deleted successfully!");
      const data = await getTasks();
      setFilteredTasks(data.tasks);
    } catch (error) {
      setError("Error deleting task. Please try again.");
    }
  };

  const showConfirm = (): Promise<boolean> => {
    setVisibleConfirm(true);
    return new Promise((resolve) => {
      setOnConfirm(() => (result: boolean) => {
        setVisibleConfirm(false);
        resolve(result);
      });
    });
  };

  const refreshTask = async () => {

    try {
      toast.success("✅ Tasks refreshed!");
      const data = await getTasks(searchTerm,statusSearch, page, pageSize, sortBy, sortOrder);
        setFilteredTasks(data.tasks); // Inicializace filtrovaných úkolů
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
        setLoading(false);
        setFilteredTasks(data.tasks);
        
    } catch (error) {
      setError("Error getting data. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📝 Task List</h1>
      <ToastContainer aria-label="Notification container" />
      {error ? (
        <>
          <WarningBox err={error}/>
        </>
      ) : (
        <>
        {/* Search & Filter Menu */}
        <SearchMenu onFilterChange={handleFilterChange} />
      {loading ? (
        <NotificationBox name={"Loading ..."} />
      ) : (
        <>
          
          {/* Task List */}
          <TaskList taskList={filteredTasks} onDeleteTask={handleDeleteTask} refreshTasks={refreshTask} />
          {/* 🔥 PAGINACE */}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          <ConfirmModal message="Are you sure to delete this task?" onConfirm={onConfirm!} visible={visibleConfirm} secondaryMessage="Every activities associated with this task will be deleted also"/>
        </>
      )}
       </>
      )}
    </div>
  );
}