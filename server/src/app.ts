import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Hello from NotifyHub backend!");
});

// Routes
app.use("/api/auth", authRoutes);

export default app;