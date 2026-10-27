"use client";

import { createContext, useContext } from "react";
import { resolveImage, type ImageOverrides, type SlotId } from "@/config/images";

const SiteImagesContext = createContext<ImageOverrides>({});

/** Foto pengganti dari panel admin, dibaca server lalu diteruskan ke komponen halaman. */
export function SiteImagesProvider({
  overrides,
  children,
}: {
  overrides: ImageOverrides;
  children: React.ReactNode;
}) {
  return <SiteImagesContext.Provider value={overrides}>{children}</SiteImagesContext.Provider>;
}

/** Mengembalikan fungsi pemilih foto: pengganti dari panel bila ada, selain itu foto default. */
export function useSiteImage() {
  const overrides = useContext(SiteImagesContext);
  return (id: SlotId) => resolveImage(overrides, id);
}
