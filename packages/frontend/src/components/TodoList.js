import React from 'react';
import TodoCard from './TodoCard';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  const hasOverdueItems = todos.some((todo) => {
    const isCompleted = todo.completed === 1 || todo.completed === true;
    return Boolean(todo.isOverdue) && !isCompleted;
  });

  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div className={`todo-list ${hasOverdueItems ? 'has-overdue-items' : ''}`}>
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
