import TodoItem from "./TodoItem";

export default function TodoList({ todos, onDelete, onComplete }) {
  return (
    <div className="todo-list">
      {todos.map((item) => (
        <TodoItem key={item._id} item={item} onDelete={onDelete} onComplete={onComplete} />
      ))}
    </div>
  );
}
