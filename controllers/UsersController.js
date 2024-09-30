import dbClient from '../utils/db.js';
import crypto from 'crypto';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the database
    const existingUser = await dbClient.nbUsers(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Already exists' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Create the new user object
    const newUser = {
      email: email,
      password: hashedPassword,
    };

    // Save the new user in the users collection
    await dbClient.saveUser(newUser);  // Make sure this function is implemented in db.js

    // Respond with the new user details
    res.status(201).json({ id: newUser._id, email: newUser.email });
  }
}

export default UsersController;
