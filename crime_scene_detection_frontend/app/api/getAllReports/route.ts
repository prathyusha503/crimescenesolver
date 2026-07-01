import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB config
const uri = process.env.MONGODB_URI as string;
const dbName = "crimeSceneDB";
const collectionName = "reports";

export const runtime = "nodejs";

export async function GET() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get all reports sorted by uploadedAt ascending (oldest first)
    const allReports = await collection
      .find({})
      .sort({ uploadedAt: 1 })
      .toArray();

    await client.close();

    // Separate text and video reports
    const textReports = allReports.filter(r => r.type === "text/plain");
    const videoReports = allReports.filter(r => r.type === "video/mp4");

    const grouped: { text?: any; video?: any }[] = [];

    const maxLen = Math.max(textReports.length, videoReports.length);
    for (let i = 0; i < maxLen; i++) {
      grouped.push({
        text: textReports[i] || null,
        video: videoReports[i] || null
      });
    }

    return NextResponse.json(grouped, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching grouped reports:", error);
    return NextResponse.json({ message: "Error retrieving grouped reports" }, { status: 500 });
  }
}