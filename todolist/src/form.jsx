import React, { useState } from 'react'

export default function Form({setData}) {
    const [text, setText] = useState("")
    async function handleSubmit(e) {
        e.preventDefault();
        if (text.trim() === "") {
            return;
            alert("Please enter a task");
        }
        const API = "http://localhost:5000";
        const res = await fetch(`${API}/todos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                completed: 0,
                due: null,
                priority: "Medium",
                category: null
            })
        });
        const newdata = await res.json();
        setData(prevData => [newdata, ...prevData]);
        setText("");


    }
    return (
        <div>form
            <label htmlFor="">Task:</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handleSubmit}>Add</button>
        </div>
    )
}
