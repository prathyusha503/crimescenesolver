import { connectToDB } from '@/lib/mongodb';
import Admin from '../../../models/Admin'; // adjust based on your folder structure
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDB();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const newAdmin = new Admin({ email, password }); // storing plain (unhashed) password
    await newAdmin.save();

    return NextResponse.json({ message: 'Admin created successfully', isAdmin: true });
  } catch (err) {
    console.error('Admin signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}