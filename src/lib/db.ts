import mongoose from 'mongoose';
import { env } from './env';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongoose ?? {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(env.DATABASE_URL, opts)
      .then(async (mongoose) => {
        // Initialize default entries after connection (non-blocking)
        if (typeof window === 'undefined') {
          import('./init-defaults')
            .then(({ ensureDefaultsInitialized }) => {
              return ensureDefaultsInitialized();
            })
            .catch((error) => {
              console.error('Failed to initialize defaults:', error);
            });
        }
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
