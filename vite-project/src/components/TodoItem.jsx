import { useState } from "react";

const API = "http://localhost:5000";

export default function TodoItem({ todo, todos, setTodos }) {
  const [editing, setEditing] = useState(false);

  // Editable fields
  const [text, setText] = useState(todo.text);
  const [due, setDue] = useState(todo.due || "");
  const [priority, setPriority] = useState(todo.priority || "Medium");
  const [category, setCategory] = useState(todo.category || "");

  function startEdit() {
    // reset fields to original values before editing
    setText(todo.text);
    setDue(todo.due || "");
    setPriority(todo.priority || "Medium");
    setCategory(todo.category || "");
    setEditing(true);
  }

  function cancelEdit() {
    // restore original values
    setText(todo.text);
    setDue(todo.due || "");
    setPriority(todo.priority || "Medium");
    setCategory(todo.category || "");
    setEditing(false);
  }

  async function toggleComplete() {
    const res = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: todo.completed ? 0 : 1 }),
    });

    if (res.ok) {
      setTodos(todos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      ));
    }
  }

  async function deleteTodo() {
    await fetch(`${API}/todos/${todo.id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== todo.id));
  }

  async function saveEdit() {
    const res = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, due, priority, category }),
    });

    if (res.ok) {
      setTodos(todos.map(t =>
        t.id === todo.id ? { ...t, text, due, priority, category } : t
      ));
      setEditing(false);
    }
  }

  function formatDate(d) {
    if (!d) return "No date";
    return new Date(d).toLocaleString();
  }

  return (
    <li className={`task-card ${todo.completed ? "completed" : ""}`}>
      <div className="task-left">
        {editing ? (
          <>
            <input value={text} onChange={e => setText(e.target.value)} />
            <input type="datetime-local" value={due} onChange={e => setDue(e.target.value)} />

            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />

            <div className="task-actions">
              <button onClick={saveEdit}>💾</button>
              <button onClick={cancelEdit}>❌</button>
            </div>
          </>
        ) : (
          <>
            <h4 onClick={toggleComplete}>{todo.text}</h4>
            <div className="task-info">
              ⏰ {formatDate(todo.due)} | {todo.priority} | {todo.category || "General"}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="task-actions">
          <button onClick={startEdit}>✏️</button>
          <button onClick={deleteTodo}>🗑️</button>
        </div>
      )}
    </li>
  );
}
