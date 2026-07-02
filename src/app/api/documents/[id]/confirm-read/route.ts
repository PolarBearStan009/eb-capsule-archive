import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

// Marks one reader as having read + acknowledged one document.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { readerName } = await request.json();

  if (!readerName) {
    return NextResponse.json(
      { error: "readerName is required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("read_receipts")
    .update({
      has_read: true,
      responded_at: new Date().toISOString().slice(0, 10),
    })
    .eq("document_id", id)
    .eq("reader_name", readerName);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
