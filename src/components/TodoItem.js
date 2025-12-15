export default function TodoItem({ item, onDelete, onComplete }) {
  return (
    <div className={`todo-list-item ${item.completed ? "completed" : ""}`}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.completedOn && (
        <small>Completed on: {new Date(item.completedOn).toLocaleString()}</small>
      )}
      <div>
        {!item.completed && <button onClick={() => onComplete(item._id)}>Complete</button>}
        <button onClick={() => onDelete(item._id)}>Delete</button>
      </div>
    </div>
  );
}
