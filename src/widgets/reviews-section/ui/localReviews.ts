export type LocalReviewRecord = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: "pending" | "approved";
  photo: Blob | null;
};

const DATABASE_NAME = "filter-support-local-reviews";
const STORE_NAME = "reviews";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runRequest<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

export function getLocalReviews() {
  return runRequest<LocalReviewRecord[]>("readonly", (store) => store.getAll());
}

export function saveLocalReview(review: LocalReviewRecord) {
  return runRequest<IDBValidKey>("readwrite", (store) => store.add(review));
}

export function updateLocalReview(review: LocalReviewRecord) {
  return runRequest<IDBValidKey>("readwrite", (store) => store.put(review));
}

export function deleteLocalReview(id: string) {
  return runRequest<undefined>("readwrite", (store) => store.delete(id));
}
