import "module-alias/register";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as nodemailer from "nodemailer";

// Routes
import UserRoutes from "./routes/user";
import CategoryRoutes from "./routes/category";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME as string,
    pass: process.env.MAIL_PASSWORD as string,
    clientId: process.env.OAUTH_CLIENTID as string,
    clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN as string,
    accessToken: process.env.OAUTH_ACCESS_TOKEN as string,
  },
});

app.use(bodyParser.json());

app.use("/api/auth", UserRoutes);
app.use("/api/category", CategoryRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Sweeft nodejs");
});

mongoose.connect(DB_URL).then(() => {
  app.listen(port, () => {
    console.log("Application Started");
  });
});
