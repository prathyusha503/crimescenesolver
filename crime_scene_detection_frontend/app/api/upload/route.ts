// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file') as File;
//     if (!file) throw new Error('No file uploaded');

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
//     if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

//     const filePath = path.join(uploadsDir, file.name);
//     fs.writeFileSync(filePath, buffer);

//     return NextResponse.json({ message: 'Upload successful' });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
//   }
// }






// File: app/api/upload/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export const runtime = "nodejs";

const uri = process.env.MONGODB_URI as string;
const dbName = "crimeSceneDB";
const collectionName = "reports";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${uuidv4()}_${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save the file
    await writeFile(filePath, buffer);

    // Connect to MongoDB and insert metadata
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne({
      filename,
      uploadedAt: new Date(),
      size: file.size,
      type: file.type,
    });

    await client.close();

    return NextResponse.json({ message: "Video uploaded successfully", filename });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
