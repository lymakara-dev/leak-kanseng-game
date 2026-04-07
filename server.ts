import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  const PORT = 3000;

  let lobbyPlayers: { [id: string]: { id: string; name: string; avatarIndex: number; x: number; y: number; status: string; isMock?: boolean } } = {};

  // Mock players for demo
  const mockPlayers = [
    { id: 'm1', name: 'វិបុល', avatarIndex: 0, x: 100, y: 100, status: 'Active', isMock: true },
    { id: 'm2', name: 'សុខ', avatarIndex: 1, x: -100, y: 100, status: 'Active', isMock: true },
    { id: 'm3', name: 'ដារ៉ា', avatarIndex: 2, x: 100, y: -100, status: 'Active', isMock: true },
    { id: 'm4', name: 'លក្ខណ៍', avatarIndex: 3, x: -100, y: -100, status: 'Active', isMock: true },
  ];

  let allPlayers: { id: string; name: string; avatarIndex: number; x: number; y: number; status: string; isMock?: boolean }[] = [...mockPlayers];

  // Simulate movement
  setInterval(() => {
    allPlayers = allPlayers.map(p => {
      const newX = p.x + (Math.random() - 0.5) * 10;
      const newY = p.y + (Math.random() - 0.5) * 10;
      return {
        ...p,
        // Keep within radar bounds (approx -200 to 200)
        x: Math.max(-200, Math.min(200, newX)),
        y: Math.max(-200, Math.min(200, newY)),
      };
    });
    io.emit("players_update", allPlayers);
  }, 2000);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    // Send current state to the new connection
    socket.emit("players_update", allPlayers);

    socket.on("join_lobby", (data) => {
      const newPlayer = {
        id: socket.id,
        name: data.name,
        avatarIndex: data.avatarIndex,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        status: 'Active'
      };
      lobbyPlayers[socket.id] = newPlayer;
      allPlayers.push(newPlayer);
      
      console.log("Player joined lobby:", data.name);
      io.emit("players_update", allPlayers);
      io.emit("player_count_update", { count: allPlayers.length });
    });

    socket.on("drop_kanseng", (data) => {
      console.log("Kanseng dropped on player:", data.targetId);
      // Broadcast to all other players
      socket.broadcast.emit("kanseng_dropped", data);
    });

    socket.on("start_game", () => {
      console.log("Game starting...");
      // Broadcast to all players that the game has started
      io.emit("game_started");
    });

    socket.on("disconnect", () => {
      if (lobbyPlayers[socket.id]) {
        console.log("Player left lobby:", lobbyPlayers[socket.id].name);
        allPlayers = allPlayers.filter(p => p.id !== socket.id);
        delete lobbyPlayers[socket.id];
        io.emit("players_update", allPlayers);
        io.emit("player_count_update", { count: allPlayers.length });
      }
      console.log("User disconnected:", socket.id);
    });
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock data for news
  app.get("/api/news", (req, res) => {
    res.json([
      {
        id: 1,
        category: "កម្សាន្ត",
        time: "១២ នាទីមុន",
        title: "ត្រៀមខ្លួនសម្រាប់កម្មវិធី \"សង្ក្រាន្តវត្តភ្នំ\"៖ ការបង្ហាញក្បាច់គុនល្បុក្កតោ និងការលេងល្បែងប្រជាប្រិយខ្មែរគ្រប់ប្រភេទ",
        excerpt: "ឆ្នាំនេះ រដ្ឋបាលរាជធានីភ្នំពេញ បានរៀបចំកម្មវិធីយ៉ាងអធិកអធមបំផុត ដើម្បីអបអរសាទរពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ។ សកម្មភាពសំខាន់ៗរួមមាន ការបោះអង្គញ់ ចោលឈូង និងជាពិសេសគឺ \"ការលាក់កន្សែង\" ដែលមានអ្នកចូលរួមច្រើនកុះករ...",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7oxef8v-l9qARF5lFq0t80L8AFgByeip5l9hw9vcXGXaStGVvcl4mxPu9FqQ7uzX6EhnRubxlzniWrhun6Vmr6TTgVn0Nolc4BG1EpX_oW_dyYYxlYmY8426ghWcqg-K68OTJi6AcaD6nvvUEpKre05-lTOwOJEDibkMyKlq5N7VadZlj2P2ZK4QB-GbEHi8rnXDt4auCYyQaHqYiWbUXAHu5x8wtRztpQE4XyRnOHKQgipNLFTPmnGMIkKBp19BdI6PStd67HOE"
      }
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
