import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/api/todos");
    const todos = await res.json();
    setActiveTodos(todos.filter((t) => !t.completed));
    setCompletedTodos(todos.filter((t) => t.completed));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTitle || !newDescription) return;
    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });
    const todo = await res.json();
    setActiveTodos([...activeTodos, todo]);
    setNewTitle("");
    setNewDescription("");
  };

  const handleComplete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
    });
    const updated = await res.json();
    setActiveTodos(activeTodos.filter((t) => t._id !== id));
    setCompletedTodos([...completedTodos, updated]);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });
    const todos = await res.json();
    setActiveTodos(todos.filter((t) => !t.completed));
    setCompletedTodos(todos.filter((t) => t.completed));
  };

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">
        <div className="todo-list-container">
          <h2>Active Todos</h2>
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Task description"
              />
            </div>
            <button onClick={handleAddTodo}>Add Todo</button>
          </div>

          {activeTodos.map((todo) => (
            <div className="todo-list-item" key={todo._id}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <div className="todo-btns">
                <button onClick={() => handleComplete(todo._id)}>Complete</button>
                <button onClick={() => handleDelete(todo._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="todo-list-container">
          <h2>Completed Todos</h2>
          {completedTodos.map((todo) => (
            <div className="todo-list-item completed" key={todo._id}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              {todo.completedOn && (
                <p className="completed-date">
                  Completed on: {new Date(todo.completedOn).toLocaleString()}
                </p>
              )}
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
