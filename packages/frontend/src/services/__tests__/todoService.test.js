import TodoService from '../todoService';

const FIXED_NOW = new Date('2026-03-06T10:00:00');

const overdueFixtures = {
  // Fixture setup notes for overdue fallback behavior aligned with FIXED_NOW.
  pastDue: '2026-03-05',
  dueToday: '2026-03-06',
  futureDue: '2026-03-07',
  invalidDueDate: 'not-a-date',
};

describe('TodoService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should fetch all todos', async () => {
      const mockTodos = [
        { id: 1, title: 'Todo 1', completed: 0, dueDate: null },
        { id: 2, title: 'Todo 2', completed: 1, dueDate: '2025-12-25' }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos
      });

      const result = await TodoService.getAllTodos();

      expect(global.fetch).toHaveBeenCalledWith('/api/todos');
      expect(result).toEqual([
        { id: 1, title: 'Todo 1', completed: 0, dueDate: null, isOverdue: false },
        { id: 2, title: 'Todo 2', completed: 1, dueDate: '2025-12-25', isOverdue: false }
      ]);
    });

    it('should throw error when fetch fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      });

      await expect(TodoService.getAllTodos()).rejects.toThrow();
    });

    it('should keep backend isOverdue when it is a boolean', async () => {
      const mockTodos = [
        { id: 1, title: 'From API', completed: 0, dueDate: overdueFixtures.futureDue, isOverdue: true }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos
      });

      const result = await TodoService.getAllTodos();
      expect(result[0].isOverdue).toBe(true);
    });

    it('should compute fallback isOverdue for missing backend field', async () => {
      const mockTodos = [
        { id: 1, title: 'Past Due Missing Field', completed: 0, dueDate: overdueFixtures.pastDue },
        { id: 2, title: 'Due Today Missing Field', completed: 0, dueDate: overdueFixtures.dueToday }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos
      });

      const result = await TodoService.getAllTodos();
      expect(result[0].isOverdue).toBe(true);
      expect(result[1].isOverdue).toBe(false);
    });

    it('should compute fallback isOverdue for invalid backend field', async () => {
      const mockTodos = [
        { id: 1, title: 'Past Due Invalid Flag', completed: 0, dueDate: overdueFixtures.pastDue, isOverdue: 'yes' },
        { id: 2, title: 'Completed Past Due', completed: 1, dueDate: overdueFixtures.pastDue, isOverdue: null },
        { id: 3, title: 'Invalid Date', completed: 0, dueDate: overdueFixtures.invalidDueDate, isOverdue: 1 }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos
      });

      const result = await TodoService.getAllTodos();
      expect(result[0].isOverdue).toBe(true);
      expect(result[1].isOverdue).toBe(false);
      expect(result[2].isOverdue).toBe(false);
    });
  });

  describe('getTodoById', () => {
    it('should fetch single todo by ID', async () => {
      const mockTodo = { id: 1, title: 'Todo 1', completed: 0, dueDate: null };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo
      });

      const result = await TodoService.getTodoById(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1');
      expect(result).toEqual(mockTodo);
    });

    it('should throw error for non-existent todo', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      });

      await expect(TodoService.getTodoById(999)).rejects.toThrow();
    });
  });

  describe('createTodo', () => {
    it('should create todo with title only', async () => {
      const mockTodo = { id: 1, title: 'New Todo', completed: 0, dueDate: null };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo
      });

      const result = await TodoService.createTodo('New Todo');

      expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Todo', dueDate: null })
      });
      expect(result).toEqual(mockTodo);
    });

    it('should create todo with title and due date', async () => {
      const mockTodo = { id: 1, title: 'New Todo', completed: 0, dueDate: '2025-12-25' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo
      });

      const result = await TodoService.createTodo('New Todo', '2025-12-25');

      expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Todo', dueDate: '2025-12-25' })
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw error with custom message from server', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Title is required' })
      });

      await expect(TodoService.createTodo('')).rejects.toThrow('Title is required');
    });
  });

  describe('updateTodo', () => {
    it('should update todo title and due date', async () => {
      const mockTodo = { id: 1, title: 'Updated Todo', completed: 0, dueDate: '2025-12-31' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo
      });

      const result = await TodoService.updateTodo(1, 'Updated Todo', '2025-12-31');

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Todo', dueDate: '2025-12-31' })
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw error when update fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Todo not found' })
      });

      await expect(TodoService.updateTodo(999, 'Title', null)).rejects.toThrow('Todo not found');
    });
  });

  describe('toggleTodoStatus', () => {
    it('should toggle todo completion status', async () => {
      const mockTodo = { id: 1, title: 'Todo', completed: 1, dueDate: null };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo
      });

      const result = await TodoService.toggleTodoStatus(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1/toggle', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw error when toggle fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Todo not found' })
      });

      await expect(TodoService.toggleTodoStatus(999)).rejects.toThrow('Todo not found');
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo', async () => {
      const mockResponse = { message: 'Deleted', id: 1 };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await TodoService.deleteTodo(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when delete fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Todo not found' })
      });

      await expect(TodoService.deleteTodo(999)).rejects.toThrow('Todo not found');
    });
  });
});
