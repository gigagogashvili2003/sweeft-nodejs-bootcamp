import "module-alias/register";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// Routes
import UserRoutes from "./routes/user";
import CategoryRoutes from "./routes/category";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

app.use(bodyParser.json());

app.use("/api/auth", UserRoutes);
app.use("/api/category", CategoryRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

mongoose.connect(DB_URL).then(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
