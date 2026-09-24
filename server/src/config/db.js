import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/questboard', {
      maxPoolSize: 10,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error]: ${error.message}`);
    // In production or development without local mongo, log clearly
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
