import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabaseClient";
import { orgMembers } from "@/lib/orgMembers";
import type { DocumentPod } from "@/lib/documentPods";

// Lists every document with its read-receipt checklist attached.
export async function GET() {
  const supabase = getSupabase();
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("*")
    .order("published_at", { ascending: false });

  if (documentsError) {
    return NextResponse.json({ error: documentsError.message }, { status: 500 });
  }

  const { data: receipts, error: receiptsError } = await supabase
    .from("read_receipts")
    .select("*");

  if (receiptsError) {
    return NextResponse.json({ error: receiptsError.message }, { status: 500 });
  }

  const pods: DocumentPod[] = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    genre: doc.genre,
    model: doc.model ?? "n/a",
    system: doc.system ?? "n/a",
    useCase: doc.use_case ?? "n/a",
    version: doc.version ?? "n/a",
    powerLevel: doc.power_level,
    publishedAt: doc.published_at,
    classificationTier: doc.classification_tier,
    acknowledgmentQuestion: doc.acknowledgment_question,
    readers: receipts
      .filter((receipt) => receipt.document_id === doc.id)
      .map((receipt) => ({
        name: receipt.reader_name,
        hasRead: receipt.has_read,
        respondedAt: receipt.responded_at ?? undefined,
      })),
  }));

  return NextResponse.json(pods);
}

// Uploads a new PDF and creates its metadata row + a fresh, all-unread
// checklist for every org member.
export async function POST(request: Request) {
  const supabase = getSupabase();
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string | null;
  const genre = formData.get("genre") as string | null;

  if (!file || !title || !genre) {
    return NextResponse.json(
      { error: "title, genre, and file are required" },
      { status: 400 }
    );
  }

  const model = (formData.get("model") as string) || null;
  const system = (formData.get("system") as string) || null;
  const useCase = (formData.get("useCase") as string) || null;
  const version = (formData.get("version") as string) || null;
  const classificationTier = Number(formData.get("classificationTier")) || 3;

  const filePath = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("documents")
    .insert({
      title,
      genre,
      model,
      system,
      use_case: useCase,
      version,
      file_path: filePath,
      classification_tier: classificationTier,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const receiptRows = orgMembers.map((name) => ({
    document_id: inserted.id,
    reader_name: name,
    has_read: false,
  }));

  const { error: receiptError } = await supabase
    .from("read_receipts")
    .insert(receiptRows);

  if (receiptError) {
    return NextResponse.json({ error: receiptError.message }, { status: 500 });
  }

  return NextResponse.json({ id: inserted.id }, { status: 201 });
}
