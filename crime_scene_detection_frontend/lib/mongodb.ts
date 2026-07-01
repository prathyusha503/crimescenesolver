import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('❌ Please define MONGODB_URI in .env.local');
}

let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDB() {
  if (cachedConnection) return cachedConnection;

  if (!connectionPromise) {
    console.log('🔌 Connecting to MongoDB...');

    connectionPromise = mongoose.connect(MONGODB_URI, {
      dbName: 'crimeSceneDB',
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // ⏱ 10s timeout
    });
  }

  try {
    cachedConnection = await connectionPromise;
    console.log('✅ MongoDB connected');
    return cachedConnection;
  } catch (err: any) {
    connectionPromise = null;
    console.error('❌ MongoDB connection failed:', err.message || err);
    throw new Error('MongoDB connection error: ' + (err.message || err));
  }
}



// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error('❌ Please define MONGODB_URI in .env.local');
// }

// let cachedConnection: typeof mongoose | null = null;
// let connectionPromise: Promise<typeof mongoose> | null = null;

// export async function connectToDB() {
//   if (cachedConnection) return cachedConnection;

//   if (!connectionPromise) {
//     console.log('🔌 Attempting MongoDB connection with URI:', MONGODB_URI);

//     connectionPromise = mongoose.connect(MONGODB_URI, {
//       dbName: 'crimeSceneDB',
//       bufferCommands: false,
//       serverSelectionTimeoutMS: 10000, // ⏱ 10 seconds timeout to prevent long hangs
//     });
//   }

//   try {
//     cachedConnection = await connectionPromise;
//     console.log('✅ MongoDB connected');
//     return cachedConnection;
//   } catch (err: any) {
//     connectionPromise = null;
//     console.error('❌ MongoDB connection failed:', err.message || err);
//     throw new Error('MongoDB connection error: ' + (err.message || err));
//   }
// }




// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error('❌ Please define MONGODB_URI in .env.local');
// }

// let cached = global.mongoose || { conn: null, promise: null };

// export async function connectToDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     console.log('🔌 Connecting to MongoDB...');
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       dbName: 'crimeSceneDB',
//       bufferCommands: false,
//     }).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// declare global {
//   var mongoose: any;
// }

// global.mongoose = cached;
