import { redirect } from "next/navigation";

// The Content Studio moved into the admin area. Keep old links working.
export default function StudioPage() {
  redirect("/admin/articles");
}
