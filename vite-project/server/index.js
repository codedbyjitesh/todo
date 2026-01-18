import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* 🔧 Convert JS date → MySQL DATETIME */
function toMySQLDateTime(due) {
  if (!due) return null;
  return new Date(due).toISOString().slice(0, 19).replace("T", " ");
}

/* ================== GET ================== */
app.get("/todos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

/* ================== POST ================== */
app.post("/todos", async (req, res) => {
  const { text, completed = 0, due = null, priority = "Medium", category = null } = req.body;

  try {
    const [[{ count }]] = await pool.query(
      "SELECT COUNT(*) AS count FROM todos"
    );

    if (count === 0) {
      await pool.query("ALTER TABLE todos AUTO_INCREMENT = 1");
    }

    const [result] = await pool.query(
      "INSERT INTO todos (text, completed, due, priority, category) VALUES (?, ?, ?, ?, ?)",
      [text, completed, due, priority, category]
    );

    res.json({ id: result.insertId, text, completed, due, priority, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});


/* ================== PUT ================== */
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];

    ["text", "completed", "due", "priority", "category"].forEach(key => {
      if (req.body[key] !== undefined) {
        let val = req.body[key];

        if (key === "due") {
          val = toMySQLDateTime(val);  
        }

        fields.push(`${key}=?`);
        values.push(val);
      }
    });

    if (!fields.length) return res.status(400).json({ message: "No fields to update" });

    values.push(id);

    const [result] = await pool.query(
      `UPDATE todos SET ${fields.join(", ")} WHERE id=?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo updated" });
  } catch (err) {
    console.error("PUT ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/* ================== DELETE ================== */
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM todos WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/* ================== START ================== */
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
