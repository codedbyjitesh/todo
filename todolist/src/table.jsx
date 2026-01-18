import React, { useState } from "react";

export default function Table({ data, setdata }) {
  const API = "http://localhost:5000";

  // Track which task is being edited and its new text
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // DELETE task
  async function handledelete(id) {
    await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
    });
    setdata(data.filter((task) => task.id !== id));
  }

  // SAVE updated task
  async function handleSave(id) {
    if (!editingText.trim()) return; // ignore empty
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PUT", // you need a PUT route in backend
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editingText }),
    });
    const updatedTask = await res.json();

    setdata(
      data.map((task) => (task.id === id ? { ...task, text: updatedTask.text } : task))
    );

    setEditingId(null); // exit edit mode
    setEditingText("");
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Feature</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task.id}>
              <td>
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                ) : (
                  task.text
                )}
              </td>
              <td>{task.completed ? "Completed" : "Not Completed"}</td>
              <td>
                {editingId === task.id ? (
                  <button onClick={() => handleSave(task.id)}>Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditingText(task.text); // prefill input
                    }}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handledelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
