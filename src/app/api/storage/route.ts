import { NextRequest, NextResponse } from "next/server";
import path from "path";
import supabase from "@/services/supabase";
import { db } from "@/server/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const supabaseApiUrl = process.env.SUPABASE_API_URL ?? "";
const cdnUrl = `${supabaseApiUrl}/storage/v1/object/public/fruit-rush-jsons/`;

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const rollupId: string = data.get("rollupId") as unknown as string;
  try {
    if (!file) {
      return NextResponse.json(
        { error: "Missing variables in request", success: false },
        { status: 500, statusText: "Error in the server, check the console" },
      );
    }

    const { data: fileData, error } = await supabase.storage
      .from("fruit-rush-jsons")
      .upload(uuidv4() + path.extname(file.name), file);

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "An error occurred while uploading to Supabase",
          success: false,
        },
        { status: 500, statusText: "Error in the server, check the console" },
      );
    } else {
      const updatedRollup = await db.rollup.update({
        where: {
          id: parseInt(rollupId),
        },
        data: {
          jsonUrl: cdnUrl + fileData?.path,
        },
      });
      return NextResponse.json({
        rollup: updatedRollup,
        message: "JSON uploaded and recorded into Rollup data successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}
