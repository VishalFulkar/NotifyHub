import express from "express";

const app = express();
app.use(express.json());

// basic get route
app.get("/", (req, res) => {
    res.send("Hello from NotifyHub backend!");
});

export default app;