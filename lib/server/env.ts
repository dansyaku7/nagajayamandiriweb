/**
 * Deployment preview & lokal memakai ruang data terpisah supaya uji coba tidak menimpa atau
 * mencampuri data produksi (pengaturan di Blob maupun statistik di Redis).
 */
const env = process.env.VERCEL_ENV;
export const PREFIX = env === "production" ? "njm" : `njm-${env || "local"}`;
