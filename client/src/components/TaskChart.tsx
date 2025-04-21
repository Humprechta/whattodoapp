import { TaskModel, TaskStatusEnum } from "../models/TaskModel";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface TaskChartProps {
  tasks: TaskModel[];
}

export default function TaskChart({ tasks }: TaskChartProps) {
  const statusCounts = {
    [TaskStatusEnum.New]: 0,
    [TaskStatusEnum.InProgress]: 0,
    [TaskStatusEnum.Done]: 0,
  };

  tasks.forEach(task => {
    statusCounts[task.status] += 1;
  });

  const labels = ["New", "In Progress", "Done"];
  const values = [statusCounts[TaskStatusEnum.New], statusCounts[TaskStatusEnum.InProgress], statusCounts[TaskStatusEnum.Done]];
  const colors = ["#3498db", "#f39c12", "#2ecc71"];

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(color => color + "B3"),
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Tasks by Status",
        data: values,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-100 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-center">📊 Task Statistics</h3>
      <div className="flex justify-center gap-6">
        <div className="w-1/2">
          <Pie data={pieData} />
        </div>
        <div className="w-1/2">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
