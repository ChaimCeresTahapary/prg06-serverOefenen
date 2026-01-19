import express from "express";
import mongoose from "mongoose";
import router from "./notesRouter.js";

const app = express();

try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myapp");
    console.log("Database connected");
    // Middleware voor JSON-gegevens
    app.use(express.json());

// Middleware voor www-urlencoded-gegevens
    app.use(express.urlencoded({ extended: true }));

// Routes
    app.use("/notes", router);
} catch (e) {
    app.use((req, res) => {
        res.status(500).json({ message: "Database is down. Sorry" });
    });
    console.log("Database connection failed");
}


app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});