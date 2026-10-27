import { getSeo } from "@/lib/server/store";

/**
 * File verifikasi HTML Google Search Console, dibuat dari nama file di panel.
 * /google123abc.html diarahkan ke sini lewat rewrites di next.config.ts.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const seo = await getSeo();
  if (seo.googleVerificationFile && file.toLowerCase() === seo.googleVerificationFile.toLowerCase()) {
    return new Response(`google-site-verification: ${seo.googleVerificationFile}`, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  return new Response("Not Found", { status: 404 });
}
