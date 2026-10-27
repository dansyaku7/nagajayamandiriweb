import { adminRoute, json } from "@/lib/server/api";
import { readImages } from "@/lib/server/store";

export const GET = adminRoute(async () => json({ overrides: await readImages() }));
