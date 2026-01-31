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

  // Récupérer les todos, useCallback pour ESLint
  const fetchTodos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des todos :", err);
    }
  }, [API_URL, token]);

  // Récupérer les todos au montage et quand le token change
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Ajouter un todo
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
      console.error("Erreur lors de l'ajout du todo :", err);
    }
  };

  // Marquer comme terminé
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

  // Supprimer un todo
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

  // Filtrer les todos
  const displayedTodos =
    filter === "active"
      ? allTodos.filter((t) => !t.completed)
      : allTodos.filter((t) => t.completed);

  return (
    <div className="App">
      <div className="header">
        <h1>Mes Todos</h1>
        <button onClick={logout}>Se déconnecter</button>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Actifs
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Terminés
        </button>
      </div>

      {filter === "active" && (
        <div className="todo-input">
          <input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleAddTodo}>Ajouter Todo</button>
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
                Terminé le : {new Date(todo.completedOn).toLocaleString()}
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
