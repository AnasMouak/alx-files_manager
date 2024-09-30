import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const user = await dbClient.findUserByEmailAndPassword(email, hashedPassword);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const redisKey = `auth_${token}`;
    

    await redisClient.set(redisKey, user._id.toString(), 'EX', 86400); // 86400 seconds = 24 hours

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const redisKey = `auth_${token}`;

    const result = await redisClient.del(redisKey);

    if (result === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.sendStatus(204);
  }
}

export default AuthController;
