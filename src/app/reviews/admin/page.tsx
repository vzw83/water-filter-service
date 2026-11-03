import { ReviewsSection } from "@/src/widgets/reviews-section";
import { AdminGate } from "@/src/features/admin-auth";

export default function ReviewsAdminPage() {
  return <AdminGate><ReviewsSection mode="admin" /></AdminGate>;
}
