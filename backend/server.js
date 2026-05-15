import 'dotenv/config';
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

import connectDB from './config/db.js';
import syncAllPlatforms from './services/syncScheduler.js';

import authRoutes from './routes/authRoutes.js';
import platformRoutes from "./routes/platformRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import problemRoutes from './routes/problemRoutes.js';
import circleRoutes from "./routes/circleRoutes.js";
import temperRoutes from "./routes/temperRoutes.js";


import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/message.js";
import Circle from "./models/circle.js";
import TemperMessage from "./models/temperMessage.js";
import TemperGroup from "./models/temperGroup.js";

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
const port = process.env.PORT || 8080;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["ngrok-skip-browser-warning"],
        credentials: true
    },
    allowEIO3: true
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_circle", (slug) => {
        socket.join(slug);
        console.log(`User joined circle: ${slug}`);
    });

    socket.on("send_message", async (data) => {
        const { slug, content, senderId, username } = data;
        
        try {
            const circle = await Circle.findOne({ slug });
            if (circle) {
                const newMessage = await Message.create({
                    circleId: circle._id,
                    sender: senderId,
                    username,
                    content
                });
                io.to(slug).emit("receive_message", newMessage);
            }
        } catch (err) {
            console.error("Socket Message Error:", err);
        }
    });

    socket.on("join_temper", (slug) => {
        socket.join(slug);
        console.log(`User joined temper: ${slug}`);
    });

    socket.on("send_temper_message", async (data) => {
        const { slug, content, senderId, username } = data;
        try {
            const group = await TemperGroup.findOne({ slug });
            if (group) {
                const newMessage = await TemperMessage.create({
                    groupId: group._id,
                    sender: senderId,
                    username,
                    content
                });
                io.to(slug).emit("receive_temper_message", newMessage);
            }
        } catch (err) {
            console.error("Temper Socket Error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const initTempFolder = async () => {
    const tempPath = path.join(process.cwd(), "temp");
    try {
        await fs.access(tempPath);
    } catch {
        await fs.mkdir(tempPath, { recursive: true });
        console.log("Temp folder initialized");
    }
};

connectDB().then(async () => {
    await initTempFolder(); 
    syncAllPlatforms(); 
    console.log("Background Synchronization Started.");
    httpServer.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
}).catch((err) => {
    console.error("Failed to start server due to DB connection error:", err);
});


app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", platformRoutes);
app.use("/api/user", userRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/circles", circleRoutes);
app.use("/api/tempers", temperRoutes);