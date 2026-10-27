import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "./auth";
import { StorageDisabledError } from "./store";

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });

/**
 * Bungkus handler admin: tolak bila belum masuk, dan ubah galat penyimpanan menjadi pesan JSON
 * yang bisa ditampilkan panel.
 */
export function adminRoute<C>(handler: (req: NextRequest, ctx: C) => Promise<Response>) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    if (!isAuthenticated(req)) return json({ message: "Sesi berakhir, silakan masuk kembali." }, 401);
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof StorageDisabledError) return json({ message: err.message }, 503);
      console.error(err);
      return json({ message: "Terjadi kesalahan server." }, 500);
    }
  };
}
