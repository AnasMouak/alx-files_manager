import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${host}:${port}`);
    this.db = this.client.db(database);
    
    // Connect to the database
    this.client.connect()
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
      });
  }

  async nbUsers() {
    const count = await this.db.collection('users').countDocuments();
    return count;
  }

  async nbFiles() {
    const count = await this.db.collection('files').countDocuments();
    return count;
  }

  async saveUser(user) {
    const result = await this.db.collection('users').insertOne(user);
    return result;
  }
}

const dbClient = new DBClient();
export default dbClient;
