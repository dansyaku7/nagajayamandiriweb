import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // INI WAJIB ADA BIAR BACKGROUND JADI KUNING
        brand: {
          yellow: "#FDFE33", 
          red: "#FF3B30",    
          black: "#1A1A1A",  
        }
      },
    },
  },
  plugins: [],
};
export default config;