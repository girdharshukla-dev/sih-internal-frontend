import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface Task {
  id: number;
  text_id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  assigned_to_name: string; // get the name from backend
  created_at: string;
  updated_at: string;
}

export default function TasksByEmailPage() {
  const { email } = useParams<{ email: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    fetch(`http://localhost:8000/task/email/${email}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json() as Promise<Task[]>;
      })
      .then(data => {
        setTasks(data);
        setUsername(data[0]?.assigned_to_name ?? "User"); // get username from first task
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <div className="text-center mt-10">Loading tasks...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Error: {error}</div>;
  if (!tasks.length) return <div className="text-center mt-10">No tasks found for {email}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {username ? username.charAt(0).toUpperCase() + username.slice(1) : "User"}'s Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div
            key={task.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-lg font-bold mb-2">{task.title}</h3>
            <p className="text-gray-700 mb-2">{task.description ?? "No description"}</p>
            <div className="text-sm text-gray-500 mb-1">
              Status: <span className={`font-semibold ${task.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>{task.status}</span>
            </div>
            <div className="text-sm text-gray-500">
              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
