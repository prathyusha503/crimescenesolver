// import { connectToDB } from '@/lib/mongodb';
// import { User } from '../../../models/User';
// import { Admin } from '../../../models/Admin';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
//     }

//     await connectToDB();

//     // Step 1: Check if email matches Admin
//     const admin = await Admin.findOne({ email });

//     if (admin && admin.password === password) {
//       return NextResponse.json({ message: 'Admin login', isAdmin: true }, { status: 200 });
//     }

//     // Step 2: Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 409 });
//     }

//     // Step 3: Create new user
//     const newUser = new User({
//       email,
//       password, // stored in plain text for now (⚠ insecure, for demo only)
//     });
//     console.log('Saving new user:', email);
//     await newUser.save();
//     console.log('User saved successfully');

//     return NextResponse.json({ message: 'User registered successfully', isAdmin: false }, { status: 201 });

//   } catch (err) {
//     console.error('Signup error:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }




// import { connectToDB } from '@/lib/mongodb';
// import { User } from '../../../models/User';
// import { Admin } from '../../../models/Admin';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
//     }

//     await connectToDB();

//     // Check if it's an Admin trying to log in via user signup
//     const admin = await Admin.findOne({ email });
//     if (admin && admin.password === password) {
//       return NextResponse.json({ message: 'Admin login', isAdmin: true }, { status: 200 });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 409 });
//     }

//     // Create new user
//     const newUser = new User({ email, password });
//     await newUser.save();

//     return NextResponse.json({ message: 'User registered successfully', isAdmin: false }, { status: 201 });

//   } catch (err) {
//     console.error('Signup error:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }



import { connectToDB } from '@/lib/mongodb';
import  User  from '../../../models/User';
import  Admin  from '../../../models/Admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log("✅ Received POST request to /api/user/signup");

    const { email, password } = await req.json();
    console.log("➡️ Parsed body:", email);

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectToDB();
    console.log("✅ DB connected");

    const admin = await Admin.findOne({ email });
    console.log("🔍 Checked admin");

    if (admin && admin.password === password) {
      console.log("✅ Matched admin");
      return NextResponse.json({ message: 'Admin login', isAdmin: true }, { status: 200 });
    }

    const existingUser = await User.findOne({ email });
    console.log("🔍 Checked existing user");

    if (existingUser) {
      console.log("❌ User already exists");
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    console.log("✅ New user saved");

    return NextResponse.json({ message: 'User registered successfully', isAdmin: false }, { status: 201 });

  } catch (err) {
    console.error('❌ Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
