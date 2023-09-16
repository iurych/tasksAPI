import { AppError } from '../errors.js';

export const bodyIsValid = (req, res) => {

 if(!req.body['title'] || !req.body['description']) throw new AppError('Tile and Description must be provided');
  
}