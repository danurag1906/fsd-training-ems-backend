import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import employeeRouter from "./routes/employee.routes.js";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const PORT = 8000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2],
    credentials: true, // if you want to allow cookies to be sent across domains
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/employee", employeeRouter);

// app.get("/hello", (req, res) => {
//   res.send("hello world");
// });

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
