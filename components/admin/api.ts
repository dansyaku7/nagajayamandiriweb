import type { ImageOverrides, SlotId } from "@/config/images";
import type { SeoSettings } from "@/config/seo";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Partial<Record<keyof SeoSettings, string>>,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    credentials: "same-origin",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await res.json().catch(() => ({}))) as { message?: string; errors?: ApiError["errors"] } & T;
  if (!res.ok) throw new ApiError(body.message ?? `Permintaan gagal (${res.status})`, res.status, body.errors);
  return body;
}

export const api = {
  session: () => request<{ authenticated: boolean }>("/session"),
  login: (password: string) => request<{ authenticated: boolean }>("/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request<{ authenticated: boolean }>("/logout", { method: "POST" }),
  getSeo: () => request<{ settings: SeoSettings; storage: boolean }>("/seo"),
  saveSeo: (settings: SeoSettings) => request<{ settings: SeoSettings }>("/seo", { method: "PUT", body: JSON.stringify(settings) }),
  getImages: () => request<{ overrides: ImageOverrides }>("/images"),
  setImageUrl: (slot: SlotId, url: string) =>
    request<{ overrides: ImageOverrides }>(`/images/${slot}`, { method: "PUT", body: JSON.stringify({ url }) }),
  resetImage: (slot: SlotId) => request<{ overrides: ImageOverrides }>(`/images/${slot}`, { method: "DELETE" }),
  uploadImage: (slot: SlotId, file: Blob) =>
    request<{ overrides: ImageOverrides }>(`/images/${slot}/upload`, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    }),
};
