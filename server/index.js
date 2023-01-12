import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRouter from "./routes/users.js"

/* Configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* File Storage */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/assets");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register)

/* Routes */
app.use("/auth", authRoutes)


/** Connect to MONGO ATLAS */
const PORT = 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    app.listen(PORT, () => console.log("Server running on port ", PORT)
  ))
  .catch((err) => console.log(err));
