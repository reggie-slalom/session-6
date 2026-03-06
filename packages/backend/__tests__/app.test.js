const request = require('supertest');
const { app, db } = require('../src/app');

const FIXED_NOW = new Date('2026-03-06T10:00:00');

const overdueFixtures = {
  // Fixture setup notes for overdue behavior: these values are tied to FIXED_NOW.
  pastDue: '2026-03-05',
  dueToday: '2026-03-06',
  futureDue: '2026-03-07',
  invalidDueDate: 'not-a-date',
};

const findByTitle = (todos, title) => todos.find((todo) => todo.title === title);

// Close the database connection after all tests
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_NOW);
});

afterAll(() => {
  jest.useRealTimers();
  if (db) {
    db.close();
  }
});

describe('Todo API Endpoints', () => {
  describe('GET /api/todos', () => {
    it('should return array of todos', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('completed');
      expect(response.body[0]).toHaveProperty('createdAt');
      expect(response.body[0]).toHaveProperty('isOverdue');
      expect(typeof response.body[0].isOverdue).toBe('boolean');
    });

    it('should return todos ordered by creation date (newest first)', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      if (response.body.length > 1) {
        const firstCreated = new Date(response.body[0].createdAt);
        const secondCreated = new Date(response.body[1].createdAt);
        expect(firstCreated.getTime()).toBeGreaterThanOrEqual(secondCreated.getTime());
      }
    });

    it('should mark only incomplete past-due todos as overdue', async () => {
      await request(app).post('/api/todos').send({ title: 'Overdue Incomplete', dueDate: overdueFixtures.pastDue });
      await request(app).post('/api/todos').send({ title: 'Due Today', dueDate: overdueFixtures.dueToday });
      await request(app).post('/api/todos').send({ title: 'Future Due', dueDate: overdueFixtures.futureDue });
      await request(app).post('/api/todos').send({ title: 'Invalid Due Date', dueDate: overdueFixtures.invalidDueDate });

      const completedPastDueCreate = await request(app)
        .post('/api/todos')
        .send({ title: 'Overdue Completed', dueDate: overdueFixtures.pastDue });
      await request(app).patch(`/api/todos/${completedPastDueCreate.body.id}/toggle`);

      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);

      const overdueIncomplete = findByTitle(response.body, 'Overdue Incomplete');
      const dueToday = findByTitle(response.body, 'Due Today');
      const futureDue = findByTitle(response.body, 'Future Due');
      const invalidDueDate = findByTitle(response.body, 'Invalid Due Date');
      const overdueCompleted = findByTitle(response.body, 'Overdue Completed');

      expect(overdueIncomplete.isOverdue).toBe(true);
      expect(dueToday.isOverdue).toBe(false);
      expect(futureDue.isOverdue).toBe(false);
      expect(invalidDueDate.isOverdue).toBe(false);
      expect(overdueCompleted.isOverdue).toBe(false);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return single todo by ID', async () => {
      const listResponse = await request(app).get('/api/todos');
      const todoId = listResponse.body[0].id;

      const response = await request(app).get(`/api/todos/${todoId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', todoId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).not.toHaveProperty('isOverdue');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).get('/api/todos/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/todos/invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Overdue edge cases', () => {
    it('should treat due-today and invalid due dates as not overdue', async () => {
      await request(app).post('/api/todos').send({ title: 'Edge Due Today', dueDate: overdueFixtures.dueToday });
      await request(app).post('/api/todos').send({ title: 'Edge Invalid Date', dueDate: overdueFixtures.invalidDueDate });

      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);

      const dueToday = findByTitle(response.body, 'Edge Due Today');
      const invalidDueDate = findByTitle(response.body, 'Edge Invalid Date');

      expect(dueToday.isOverdue).toBe(false);
      expect(invalidDueDate.isOverdue).toBe(false);
    });
  });

  describe('POST /api/todos', () => {
    it('should create new todo with title only', async () => {
      const response = await request(app).post('/api/todos').send({ title: 'Test Todo' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.completed).toBe(0);
      expect(response.body.dueDate).toBeNull();
    });

    it('should create new todo with title and due date', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Urgent Task', dueDate: '2025-12-25' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Urgent Task');
      expect(response.body.dueDate).toBe('2025-12-25');
      expect(response.body.completed).toBe(0);
    });

    it('should trim title whitespace', async () => {
      const response = await request(app).post('/api/todos').send({ title: '  Trimmed Todo  ' });
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Trimmed Todo');
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app).post('/api/todos').send({ title: '' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app).post('/api/todos').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title exceeds 255 characters', async () => {
      const longTitle = 'a'.repeat(256);
      const response = await request(app).post('/api/todos').send({ title: longTitle });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo title', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Original Title' });
      const todoId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated Title' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('Updated Title');
      expect(updateResponse.body.id).toBe(todoId);
    });

    it('should update todo due date', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Task' });
      const todoId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ dueDate: '2025-12-31' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.dueDate).toBe('2025-12-31');
    });

    it('should update both title and due date', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Task' });
      const todoId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'New Title', dueDate: '2026-01-01' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('New Title');
      expect(updateResponse.body.dueDate).toBe('2026-01-01');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/999999')
        .send({ title: 'New Title' });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .put('/api/todos/invalid')
        .send({ title: 'New Title' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title is empty', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Task' });
      const todoId = createResponse.body.id;

      const response = await request(app).put(`/api/todos/${todoId}`).send({ title: '' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo from incomplete to complete', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Task to Complete' });
      const todoId = createResponse.body.id;

      const toggleResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(1);
    });

    it('should toggle todo from complete to incomplete', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Task' });
      const todoId = createResponse.body.id;

      await request(app).patch(`/api/todos/${todoId}/toggle`);

      const toggleResponse = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(0);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).patch('/api/todos/999999/toggle');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).patch('/api/todos/invalid/toggle');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete existing todo', async () => {
      const createResponse = await request(app).post('/api/todos').send({ title: 'Todo to Delete' });
      const todoId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/api/todos/${todoId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message');
      expect(deleteResponse.body.id).toBe(todoId);

      const getResponse = await request(app).get(`/api/todos/${todoId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app).delete('/api/todos/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/api/todos/invalid');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Backward compatibility tests for old /api/items endpoints
  describe('GET /api/items (backward compatibility)', () => {
    it('should return array of items', async () => {
      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/items (backward compatibility)', () => {
    it('should create new item', async () => {
      const response = await request(app).post('/api/items').send({ name: 'Test Item' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Item');
    });
  });

  describe('DELETE /api/items/:id (backward compatibility)', () => {
    it('should delete existing item', async () => {
      const createResponse = await request(app).post('/api/items').send({ name: 'Item to Delete' });
      const itemId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/api/items/${itemId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message');
    });
  });
});