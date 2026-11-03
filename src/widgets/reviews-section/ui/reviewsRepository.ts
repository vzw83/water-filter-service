import { getSupabaseClient } from "@/src/shared/lib/supabase/client";
import { deleteLocalReview, getLocalReviews, saveLocalReview, updateLocalReview } from "./localReviews";

export type ReviewStatus = "pending" | "approved";
export type ReviewStorageMode = "local" | "cloud";

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
  photoUrl: string | null;
  photoPath: string | null;
  storage: ReviewStorageMode;
  localPhoto?: Blob | null;
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

export function getReviewStorageMode(): ReviewStorageMode {
  return getSupabaseClient() ? "cloud" : "local";
}

export async function getReviews(isAdmin: boolean) {
  const client = getSupabaseClient();
  if (!client) {
    const local = await getLocalReviews();
    return local
      .filter((review) => isAdmin || review.status === "approved")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((review): Review => ({
        ...review,
        photoPath: null,
        photoUrl: review.photo ? URL.createObjectURL(review.photo) : null,
        storage: "local",
        localPhoto: review.photo,
      }));
  }

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
    storage: "cloud",
  }));
}

export async function saveReview(input: {
  authorName: string;
  rating: number;
  comment: string;
  photo: Blob | null;
}) {
  if (input.photo && (!["image/jpeg", "image/png", "image/webp"].includes(input.photo.type) || input.photo.size > 5 * 1024 * 1024)) {
    throw new Error("Выбери фото в формате JPEG, PNG или WebP размером до 5 МБ.");
  }

  const client = getSupabaseClient();
  if (!client) {
    await saveLocalReview({
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
    });
    return "local";
  }

  let photoPath: string | null = null;

  if (input.photo) {
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
  return "cloud";
}

export async function setReviewStatus(review: Review, status: ReviewStatus) {
  if (review.storage === "local") {
    await updateLocalReview({
      id: review.id,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      status,
      photo: review.localPhoto ?? null,
    });
    return;
  }
  const { error } = await clientOrThrow().from("reviews").update({ status }).eq("id", review.id);
  if (error) throw error;
}

export async function deleteReview(review: Review) {
  if (review.storage === "local") {
    await deleteLocalReview(review.id);
    return;
  }
  const client = clientOrThrow();
  const { error } = await client.from("reviews").delete().eq("id", review.id);
  if (error) throw error;
  if (review.photoPath) {
    const { error: storageError } = await client.storage.from("review-photos").remove([review.photoPath]);
    if (storageError) throw storageError;
  }
}
