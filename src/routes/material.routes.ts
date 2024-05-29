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

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default router;
