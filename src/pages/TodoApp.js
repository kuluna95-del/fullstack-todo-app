import { useState, useEffect, useCallback } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import "./TodoApp.css";

function TodoApp({ token, logout }) {
  const [allTodos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("active"); // "active" ou "completed"

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/todos";

  // Fetch todos wrapped in useCallback to avoid ESLint warning
  const fetchTodos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  }, [API_URL, token]);

  // Fetch todos on mount and when token changes
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add todo
  const handleAddTodo = async () => {
    if (!title || !description) return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Complete todo
  const handleComplete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter todos
  const displayedTodos =
    filter === "active"
      ? allTodos.filter((t) => !t.completed)
      : allTodos.filter((t) => t.completed);

  return (
    <div className="App">
      <div className="header">
        <h1>My Todos</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {filter === "active" && (
        <div className="todo-input">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add Todo</button>
        </div>
      )}

      <div className="todo-wrapper">
        {displayedTodos.map((todo) => (
          <div
            className={`todo-list-item ${todo.completed ? "completed" : ""}`}
            key={todo._id}
          >
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            {todo.completed && todo.completedOn && (
              <p className="completed-date">
                Completed on: {new Date(todo.completedOn).toLocaleString()}
              </p>
            )}

            <div className="todo-btns">
              {!todo.completed && (
                <button
                  className="complete"
                  onClick={() => handleComplete(todo._id)}
                >
                  <BsCheckLg />
                </button>
              )}
              <button
                className="delete"
                onClick={() => handleDelete(todo._id)}
              >
                <AiOutlineDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;
