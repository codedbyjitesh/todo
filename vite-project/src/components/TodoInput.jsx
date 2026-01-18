import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, setTodos, filter, search }) {
  // Filter tasks based on search and filter
  let filtered = todos.filter(t =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === "COMPLETED") filtered = filtered.filter(t => t.completed);
  if (filter === "PENDING") filtered = filtered.filter(t => !t.completed);
  if (filter === "HIGH") filtered = filtered.filter(t => t.priority === "High");

  // Count incomplete tasks
  const incompletedCount = todos.filter(t => !t.completed).length;

  // Handle drag end
  function handleOnDragEnd(result) {
    if (!result.destination) return; // dropped outside the list

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  }

  return (
    <div>
      {/* Display incomplete tasks count */}
      <p className="incomplete-count">📝 Incomplete Tasks: {incompletedCount}</p>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filtered.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={todo.completed ? "completed" : ""}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging
                          ? "0 4px 12px rgba(0,0,0,0.2)"
                          : "none"
                      }}
                    >
                      <TodoItem todo={todo} todos={todos} setTodos={setTodos} />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
