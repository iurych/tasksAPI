import { Database } from '../database.js';

const database = new Database();
console.log(database)

export function verifyTaskExist(req, res) {
    const { title } = req.body
    
    console.log(database.select('tasks'))
    
    if(Object.keys(database) > 0) { 
      const checkTask = database.filter((data) => data.title == title)
      if (!checkTask[0]) throw new Error({ message: "A task with this title has already been created!" })
    }
  
  }