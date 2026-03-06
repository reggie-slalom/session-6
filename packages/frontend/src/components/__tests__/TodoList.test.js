import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  it('should render overdue indicator only for overdue incomplete items', () => {
    const overdueTodos = [
      { ...mockTodos[0], title: 'Overdue Item', completed: 0, isOverdue: true },
      { ...mockTodos[1], title: 'Completed Item', completed: 1, isOverdue: true }
    ];

    render(<TodoList todos={overdueTodos} {...mockHandlers} isLoading={false} />);

    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Overdue Item')).toBeInTheDocument();
    expect(screen.getByText('Completed Item')).toBeInTheDocument();
  });

  it('should apply list-level overdue state class for responsive styling', () => {
    const overdueTodos = [
      { ...mockTodos[0], isOverdue: true, completed: 0 },
      { ...mockTodos[1], isOverdue: false, completed: 0 }
    ];

    const { container } = render(<TodoList todos={overdueTodos} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-list')).toHaveClass('has-overdue-items');
  });
});
