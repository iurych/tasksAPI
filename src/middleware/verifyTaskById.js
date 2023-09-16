import { Database } from '../database.js';
import { AppError } from '../errors.js';

const database = new Database();

export const verifyIdExist = (req, res) => {
  const { id } = req.params;

  const tasks = database.select('tasks');

  const checkTask = tasks.filter((data) => data.id === id);

  if (!checkTask.length) {
    throw new AppError('Task not found', 404);
  }
}
