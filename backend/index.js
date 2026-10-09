import express from "express";
//const cors = require("cors");
import dotenv from "dotenv";
dotenv.config();
// const session = require("express-session");
// const MongoStore = require("connect-mongo").default;

import connectDB from "./config/database.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,

//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//     }),

//     cookie: {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//     },
//   }),
// );

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QueueLens API is running",
  });
});

const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();