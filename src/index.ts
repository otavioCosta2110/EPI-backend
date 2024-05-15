import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import tagRoutes from "./routes/tagRoutes";
import videoRoutes from "./routes/videoRoutes";
import threadRoutes from "./routes/threadRoutes";
import postRoutes from "./routes/postRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/thread", threadRoutes);
app.use("/post", postRoutes);
app.use("/video", videoRoutes);
app.use("/user", userRoutes);
app.use("/tag", tagRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
