import { Database } from '../database.js';
import { AppError } from '../errors.js';

const database = new Database();


export function verifyTaskExist(req, res) {
    const { title } = req.body
    
    const tasks = database.select('tasks')
    const checkTask = tasks.filter(data => data.title == title)

    if(checkTask) throw new AppError("A task with this title has already been created!", 409)
  }