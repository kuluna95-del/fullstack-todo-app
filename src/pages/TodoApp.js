import { useState, useEffect } from "react";
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

  // Récupérer les tâches
  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches :", err);
    }
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  // Ajouter une tâche
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
      console.error("Erreur lors de l’ajout de la tâche :", err);
    }
  };

  // Marquer une tâche comme terminée
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

  // Supprimer une tâche
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

  // Filtrer les tâches
  const displayedTodos =
    filter === "active"
      ? allTodos.filter((t) => !t.completed)
      : allTodos.filter((t) => t.completed);

  return (
    <div className="App">
      <div className="header">
        <h1>Mes tâches</h1>
        <button onClick={logout}>Déconnexion</button>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Actives
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Terminées
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
          <button onClick={handleAddTodo}>Ajouter une tâche</button>
        </div>
      )}

      <div className="todo-wrapper">
        {displayedTodos.map((todo) => (
          <div
            className={`todo-list-item ${
              todo.completed ? "completed" : ""
            }`}
            key={todo._id}
          >
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>

            {todo.completed && todo.completedOn && (
              <p className="completed-date">
                Terminée le :{" "}
                {new Date(todo.completedOn).toLocaleString()}
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
