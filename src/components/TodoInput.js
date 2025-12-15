export default function TodoInput({ title, description, setTitle, setDescription, onAdd }) {
  return (
    <div className="todo-input">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={onAdd}>Add Todo</button>
    </div>
  );
}
