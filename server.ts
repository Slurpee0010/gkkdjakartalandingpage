import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/events", (req, res) => {
    res.json([
      { id: 1, title: "Ibadah Raya Minggu", date: "Setiap Minggu", time: "09:00 & 11:00 WIB", location: "Main Hall" },
      { id: 2, title: "Youth Gathering", date: "Sabtu, 12 April", time: "17:00 WIB", location: "Youth Center" },
      { id: 3, title: "Doa Malam", date: "Jumat, 11 April", time: "19:00 WIB", location: "Chapel" },
    ]);
  });

  app.get("/api/services", (req, res) => {
    res.json([
      { id: 1, title: "Sekolah Minggu", description: "Pendidikan iman untuk anak-anak usia 4-12 tahun." },
      { id: 2, title: "Konseling Keluarga", description: "Layanan bimbingan untuk keharmonisan rumah tangga." },
      { id: 3, title: "Diakonia", description: "Bantuan sosial bagi jemaat dan masyarakat yang membutuhkan." },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
