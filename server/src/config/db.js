import mongoose from 'mongoose';

export async function connectDB() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017/questboard';

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error]: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Database] Running in production - please verify your MONGODB_URI in hosting settings.');
    }
  }
}
