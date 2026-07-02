import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single();

  if (doc?.file_path) {
    await supabase.storage.from("documents").remove([doc.file_path]);
  }

  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();
  const formData = await request.formData();

  const powerLevel = formData.get("powerLevel");
  const file = formData.get("file") as File | null;

  const updates: Record<string, unknown> = {};
  if (powerLevel !== null) updates.power_level = Number(powerLevel);

  if (file && file.size > 0) {
    const { data: existing } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", id)
      .single();

    if (existing?.file_path) {
      await supabase.storage.from("documents").remove([existing.file_path]);
    }

    const newPath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(newPath, file);

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 });

    updates.file_path = newPath;
  }

  const { error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
