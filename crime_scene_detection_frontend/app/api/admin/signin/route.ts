import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('crimeSceneDB');

  // ✅ First check admin
  const admin = await db.collection('admins').findOne({ email });
  if (admin && admin.password === password) {
    return NextResponse.json(
      { message: 'Admin login successful', isAdmin: true },
      { status: 200 }
    );
  }

  // ✅ Then check user
  const user = await db.collection('users').findOne({ email });
  if (user && user.password === password) {
    return NextResponse.json(
      { message: 'User login successful', isAdmin: false },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { error: 'Invalid email or password' },
    { status: 401 }
  );
}