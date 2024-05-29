import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes";
import tagRoutes from "./routes/tag.routes";
import videoRoutes from "./routes/video.routes";
import threadRoutes from "./routes/thread.routes";
import postRoutes from "./routes/post.routes";
import materialRoutes from "./routes/material.routes";
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
app.use("/material", materialRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
