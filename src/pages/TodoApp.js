// src/pages/TodoApp.js
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function TodoApp({ token, logout }) {
  const [allTodos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);

  // Fetch todos from backend on mount
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Add todo
  const handleAddTodo = async () => {
    if (!title || !description) return;

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      setTodos(data); // backend should return updated list
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle complete
  const handleComplete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>My Todos</h1>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <div>
        <button onClick={() => setIsCompleteScreen(false)}>Active</button>
        <button onClick={() => setIsCompleteScreen(true)}>Completed</button>
      </div>

      <div className="todo-wrapper">
        {!isCompleteScreen && (
          <>
            {/* Add Todo */}
            <div className="todo-input">
              <div>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button onClick={handleAddTodo}>Add Todo</button>
            </div>

            {/* Active Todos */}
            <div className="todo-list">
              {allTodos
                .filter((t) => !t.completed)
                .map((item) => (
                  <div className="todo-list-item" key={item._id}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDelete(item._id)}
                    />
                    <BsCheckLg
                      className="check-icon"
                      onClick={() => handleComplete(item._id)}
                    />
                  </div>
                ))}
            </div>
          </>
        )}

        {isCompleteScreen && (
          <div className="todo-list">
            {allTodos
              .filter((t) => t.completed)
              .map((item) => (
                <div className="todo-list-item completed" key={item._id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <small>
                      Completed on: {new Date(item.completedOn).toLocaleString()}
                    </small>
                  </p>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
