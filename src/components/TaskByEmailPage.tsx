import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface Task {
  id: number;
  text_id: string;
  assigned_to: number;
  assigned_to_name: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function TasksByEmailPage() {
  const { email } = useParams<{ email: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tasks.length) return <div>No tasks found for {email}</div>;

  return (
    <div>
      <h2>Tasks assigned to {email}</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description ?? "No description"} <br />
            Status: {task.status}, Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
