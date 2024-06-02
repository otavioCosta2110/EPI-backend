import { Router } from "express";
import multer from "multer";
import MaterialController from "../controllers/materialController";
import path from "path";
import express from "express";

const router = Router();
const materialController = new MaterialController();

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
  materialController.createMaterial
);
router.get("/getmaterial/:id", materialController.getMaterialById);
router.put("/updatematerial/:id", materialController.updateMaterial);
router.delete("/deletematerial/:id", materialController.deleteMaterial);

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

router.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../../uploads"))
);

export default router;
