import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./routes/Root";
import Dashboard from "./routes/Dashboard";
import Tasks from "./routes/Tasks";
import ErrorPage from "./routes/ErrorPage";
import TaskActivitiesGrid from './routes/Activity'; // Import komponenty pro zobrazení aktivit


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="err" element={<ErrorPage />} />

          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/tasks/:id/activities" element={<TaskActivitiesGrid />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;