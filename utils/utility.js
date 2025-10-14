import path from "path";
import multer from "multer";
import { existsSync, mkdirSync } from "fs";

const uploadPath = './assets/uploads/project_images';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

export { upload };