import { Database } from "../database.js";

const database = new Database

export async function json(req, res) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  res.setHeader('Content-Type', 'application/json');
}

export function verifyTaskExist(req, res) {
  const { title } = req.body

  if(Object.keys(database) > 0) { 
    const checkTask = database.filter((data) => data.title == title)
    if (!checkTask[0]) throw new Error({ message: "A task with this title has already been created!" })
  }

}