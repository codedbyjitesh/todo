import { useState, useEffect } from "react";
import Header from "./components/Header";
import TodoForm from "./components/TodoForm";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";
import Stats from "./components/Stats";
import "./App.css";

const API = "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [reminded, setReminded] = useState({});

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Load todos from backend
  useEffect(() => {
    fetch(`${API}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, []);

  // Reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach((todo) => {
        if (!todo.completed && todo.due) {
          const dueTime = new Date(todo.due);
          const diff = (dueTime - now) / 1000;

          if (!reminded[todo.id]) {
            if (diff <= 300 && diff > 0) {
              showNotification(`Upcoming: ${todo.text}`, "Task due soon!");
              setReminded((prev) => ({ ...prev, [todo.id]: true }));
            } else if (diff <= 0) {
              showNotification(`Overdue: ${todo.text}`, "Task time passed!");
              setReminded((prev) => ({ ...prev, [todo.id]: true }));
            }
          }
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [todos, reminded]);

  function showNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png" });
    } else {
      alert(`${title}\n${body}`);
    }
  }

  return (
    <div className="container">
      <Header />
      <TodoForm todos={todos} setTodos={setTodos} />
      <FilterBar setFilter={setFilter} setSearch={setSearch} />
      <p className="note">💡 Click on a task to mark it as Completed / Pending</p>
      <TodoList todos={todos} setTodos={setTodos} filter={filter} search={search} />
      <Stats todos={todos} />
    </div>
  );
}
