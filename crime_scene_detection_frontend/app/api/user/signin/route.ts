import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import  Admin  from '../../../models/Admin';// if you use Mongoose for admins
import User from '../../../models/User'; // if you use Mongoose for users


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectToDB();

    // Step 1: Check Admins collection
    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) {
      return NextResponse.json({ message: 'Admin login successful', isAdmin: true }, { status: 200 });
    }

    // Step 2: Check Users collection
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'User login successful', isAdmin: false }, { status: 200 });

  } catch (err) {
    console.error('Signin Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}