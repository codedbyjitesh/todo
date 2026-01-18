const express = require("express");
const cors = require("cors");
const pool = require("./db"); 

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/todos", async (req, res) => {
    const [show]=await pool.query("SELECT * FROM todos ORDER BY id DESC");
    res.json(show);
})

app.post("/todos", async (req, res) => {
   const { text, completed = 0, due = null, priority = "Medium", category = null } = req.body;
   const [insert] = await pool.query("INSERT INTO todos (text, completed, due, priority, category) VALUES (?, ?, ?, ?, ?)", [text, completed, due, priority, category]);
   res.json({ id: insert.insertId, text, completed, due, priority, category });
});

app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = ?", [id]);
    res.json({ message: "Todo deleted" });
});

// UPDATE a todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { text, completed, due, priority, category } = req.body;

    // Build query dynamically to allow partial updates
    const fields = [];
    const values = [];

    if (text !== undefined) {
        fields.push("text = ?");
        values.push(text);
    }
    if (completed !== undefined) {
        fields.push("completed = ?");
        values.push(completed);
    }
    if (due !== undefined) {
        fields.push("due = ?");
        values.push(due);
    }
    if (priority !== undefined) {
        fields.push("priority = ?");
        values.push(priority);
    }
    if (category !== undefined) {
        fields.push("category = ?");
        values.push(category);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id); // last value is the id for WHERE clause

    const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);

    // Return the updated todo
    const [updated] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    res.json(updated[0]);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

