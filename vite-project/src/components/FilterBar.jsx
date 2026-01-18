export default function FilterBar({ filter, setFilter, search, setSearch }) {
  return (
    <div className="filters">
      <input
        placeholder="Search..."
        onChange={e => setSearch(e.target.value)}
        value={search}
      />
      <button
        className={filter === "ALL" ? "active" : ""}
        onClick={() => setFilter("ALL")}
      >
        All
      </button>
      <button
        className={filter === "COMPLETED" ? "active" : ""}
        onClick={() => setFilter("COMPLETED")}
      >
        Completed
      </button>
      <button
        className={filter === "PENDING" ? "active" : ""}
        onClick={() => setFilter("PENDING")}
      >
        Pending
      </button>
      <button
        className={filter === "HIGH" ? "active" : ""}
        onClick={() => setFilter("HIGH")}
      >
        High Priority
      </button>
    </div>
  );
}
