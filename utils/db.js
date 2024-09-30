import { MongoClient } from 'mongodb';
import { promisify } from 'util';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;

    // Initialize the connection
    this.connectClient();
  }

  async connectClient() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    }
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    try {
      const usersCollection = this.db.collection('users');
      const usersCount = await usersCollection.countDocuments();
      return usersCount;
    } catch (error) {
      console.error(`Error counting users: ${error.message}`);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const filesCollection = this.db.collection('files');
      const filesCount = await filesCollection.countDocuments();
      return filesCount;
    } catch (error) {
      console.error(`Error counting files: ${error.message}`);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
