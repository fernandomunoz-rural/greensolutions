import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getViewer } from "@/lib/content/load";

// GET /admin/preview        → admins only: show the draft on the real pages
// GET /admin/preview?off=1  → anyone: back to the live site
export async function GET(request: NextRequest) {
  const draft = await draftMode();
  const url = request.nextUrl;
  if (url.searchParams.get("off")) {
    draft.disable();
    return NextResponse.redirect(new URL("/admin/content", url));
  }
  const viewer = await getViewer();
  if (!viewer.isAdmin) return NextResponse.redirect(new URL("/admin", url));
  draft.enable();
  return NextResponse.redirect(new URL("/", url));
}
