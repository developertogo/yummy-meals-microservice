import {ExpressRequestHandler} from '@loopback/rest';

export const requestHandler: ExpressRequestHandler = async (req, res, next) => {
  res.send(req.path);
};