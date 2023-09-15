import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { verifyTaskExist } from './middleware/verifyTitle.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      verifyTaskExist(req, res)

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
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
];
