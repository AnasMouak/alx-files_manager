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

  // Check if the MongoDB client is connected
  isAlive() {
    return this.client && this.client.topology && this.client.topology.isConnected();
  }

  // Get the number of documents in the 'users' collection
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

  // Get the number of documents in the 'files' collection
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

  async saveUser(user) {
    const result = await this.db.collection('users').insertOne(user);
    return result;
  }

  async findUserByEmailAndPassword(email, password) {
    const user = await this.db.collection('users').findOne({ email, password });
    return user;
  }

  async findUserById(id) {
    const user = await this.db.collection('users').findOne({ _id: new ObjectId(id) });
    return user;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
