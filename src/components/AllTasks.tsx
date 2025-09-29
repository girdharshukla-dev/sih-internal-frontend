import { useState } from "react";

type Task = {
  id: number;
  text_id: number;
  assigned_to: number;
  assigned_to_name: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export default function AllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTasks, setShowTasks] = useState<boolean>(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/task/all");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setShowTasks(true);
    fetchTasks();
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <button
        className="btn btn-wide flex justify-center items-center"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get all tasks"}
      </button>

      {showTasks && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4 flex justify-center">Tasks</h2>
          {error && <p className="text-red-500">{error}</p>}
          {!error && tasks.length === 0 && !loading && (
            <p>No tasks found.</p>
          )}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-3 shadow-sm bg-base-100
                           transition-all duration-200
                           hover:shadow-md hover:bg-base-200 hover:scale-[1.01]"
              >
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>
                    Status: <strong>{task.status}</strong>
                  </span>
                  <span>
                    Assigned To:{" "}
                    <strong>{task.assigned_to_name}</strong> (ID:{" "}
                    {task.assigned_to})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
