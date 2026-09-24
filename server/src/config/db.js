import mongoose from 'mongoose';

export async function connectDB() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017/questboard';

  // Disable command buffering so queries fail fast with clear errors instead of hanging 10 seconds
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Connection Failed]: ${error.message}`);
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.warn('⚠️ [Action Required] MONGODB_URI is not set in environment variables! Please set MONGODB_URI in Render dashboard.');
    }
  }
}
