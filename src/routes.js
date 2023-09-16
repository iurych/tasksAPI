import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { verifyTaskExist } from './middleware/verifyTitle.js';
import { verifyIdExist } from './middleware/verifyTaskById.js';
import { bodyIsValid } from './middleware/validateBody.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      try {
        bodyIsValid(req, res);
      } catch (error) {
        return res
          .writeHead(error.statusCode)
          .end(JSON.stringify(error.message));
      }

      try {
        verifyTaskExist(req, res);
      } catch (error) {
        return res
          .writeHead(error.statusCode)
          .end(JSON.stringify({ message: error.message }));
      }

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      database.insert('tasks', task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        bodyIsValid(req, res);
      } catch (error) {
        return res
          .writeHead(error.statusCode)
          .end(JSON.stringify({ message: error.message }));
      }

      const { id } = req.params;
      const { title, description } = req.body;

      try {
        verifyIdExist(req, res);
      } catch (error) {
        return res
          .writeHead(error.statusCode)
          .end(JSON.stringify({ message: error.message }));
      }

      const task = database.select(
        'tasks',
        id
          ? {
              id,
            }
          : null
      );

      database.update('tasks', id, {
        title,
        description,
        created_at: task[0].created_at,
        updated_at: new Date(),
        completed_at: task[0].completed_at,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        verifyIdExist(req, res);
      } catch (error) {
        return res
          .writeHead(error.statusCode)
          .end(JSON.stringify({ message: error.message }));
      }

      const task = database.select(
        'tasks',
        id
          ? {
              id,
            }
          : null
      );

      const taskCompleted = {
        ...task[0],
        completed_at: new Date(),
      };

      database.update('tasks', id, taskCompleted);

      return res.writeHead(204).end();
    },
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        verifyIdExist(req, res);
      } catch (error) {
        return res
          .writeHead(error.statusCode)
          .end(JSON.stringify({ message: error.message }));
      }

      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
];
