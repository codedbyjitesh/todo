import { useState } from "react";

const API = "http://localhost:5000";

export default function TodoForm({ todos, setTodos }) {
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        completed: 0,
        due: due || null, // 🔥 FIX
        priority,
        category
      }),
    });

    if (!res.ok) return;

    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);

    setText("");
    setDue("");
    setPriority("Medium");
    setCategory("");
  }

  return (
    <form onSubmit={addTodo} className="todo-form">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add new task"
        required
      />

      <input
        type="datetime-local"
        value={due}
        onChange={e => setDue(e.target.value)}
      />

      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input
        value={category}
        onChange={e => setCategory(e.target.value)}
        placeholder="Category"
      />

      <button type="submit">Add</button>
    </form>
  );
}
