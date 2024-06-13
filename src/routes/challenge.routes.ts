import { Router } from "express";
import multer from "multer";
import ChallengeController from "../controllers/challengeController";
import path from "path";
import express from "express";

const router = Router();
const challengeController = new ChallengeController();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  upload.single("file_url"),
  challengeController.createChallenge
);
router.get("/getchallenge/:id", challengeController.getChallengeById);

router.get("/getchallenges", challengeController.getChallenges);
router.get(
  "/getchallengebyvideo/:videoID",
  challengeController.getChallengeByVideoId
);

router.put("/updatechallenge/:id", challengeController.updateChallenge);

router.delete("/deletechallenge/:id", challengeController.deleteChallenge);

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, "../../uploads", filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send({
        message: "File not found.",
        error: err.message,
      });
    }
  });
});

router.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

export default router;
