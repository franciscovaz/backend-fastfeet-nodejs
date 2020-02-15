import jwt from 'jsonwebtoken';

import { promisify } from 'util'; // para fazer o decoded async
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // apanhar token e não o Bearer
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // colocar ID dentro do pedido, para ñ ser necessario enviar ID, p.e. no URL
    req.userId = decoded.id;

    // verifica se é admin
    /* if (decoded.email !== 'admin@fastfeet.com') {
      return res
        .status(401)
        .json({ error: 'You need to do login with ADMIN account.' });
    } */

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
