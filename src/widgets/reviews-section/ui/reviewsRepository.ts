import { getSupabaseClient } from "@/src/shared/lib/supabase/client";

export type ReviewStatus = "pending" | "approved";

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  photoUrl: string | null;
  photoPath: string | null;
};

type ReviewRow = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
  status: ReviewStatus;
  photo_path: string | null;
};

function clientOrThrow() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured");
  return client;
}

export async function getReviews(isAdmin: boolean) {
  const client = clientOrThrow();
  let request = client.from("reviews").select("*").order("created_at", { ascending: false });
  if (!isAdmin) request = request.eq("status", "approved");

  const { data, error } = await request;
  if (error) throw error;

  return ((data ?? []) as ReviewRow[]).map((row): Review => ({
    id: row.id,
    authorName: row.author_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    status: row.status,
    photoPath: row.photo_path,
    photoUrl: row.photo_path
      ? client.storage.from("review-photos").getPublicUrl(row.photo_path).data.publicUrl
      : null,
  }));
}

export async function saveReview(input: {
  authorName: string;
  rating: number;
  comment: string;
  photo: Blob | null;
}) {
  const client = clientOrThrow();
  let photoPath: string | null = null;

  if (input.photo) {
    if (!input.photo.type.startsWith("image/") || input.photo.size > 5 * 1024 * 1024) {
      throw new Error("Фото должно быть изображением размером до 5 МБ.");
    }
    const extension = input.photo.type === "image/png" ? "png" : input.photo.type === "image/webp" ? "webp" : "jpg";
    photoPath = `${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("review-photos").upload(photoPath, input.photo, {
      contentType: input.photo.type,
      upsert: false,
    });
    if (error) throw error;
  }

  const { error } = await client.from("reviews").insert({
    author_name: input.authorName,
    rating: input.rating,
    comment: input.comment,
    photo_path: photoPath,
    status: "pending",
  });

  if (error) {
    if (photoPath) await client.storage.from("review-photos").remove([photoPath]);
    throw error;
  }
}

export async function setReviewStatus(id: string, status: ReviewStatus) {
  const { error } = await clientOrThrow().from("reviews").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(review: Review) {
  const client = clientOrThrow();
  const { error } = await client.from("reviews").delete().eq("id", review.id);
  if (error) throw error;
  if (review.photoPath) {
    const { error: storageError } = await client.storage.from("review-photos").remove([review.photoPath]);
    if (storageError) throw storageError;
  }
}
