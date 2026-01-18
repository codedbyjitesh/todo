import TodoItem from "./TodoItem";

export default function TodoList({ todos = [], setTodos, filter, search }) {
  const filtered = todos
    .filter(todo => {
      if (filter === "COMPLETED") return todo.completed;
      if (filter === "PENDING") return !todo.completed;
      if (filter === "HIGH") return todo.priority === "High";
      return true;
    })
    .filter(todo =>
      (todo.text || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <ul className="todo-list">
      {filtered.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
        />
      ))}
    </ul>
  );
}
