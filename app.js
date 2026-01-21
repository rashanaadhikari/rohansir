import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// --- Configuration ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- Models ---
const imageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    createdAt: { type: Date, default: Date.now }
});
const Image = mongoose.model("Image", imageSchema);

// --- Middleware ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "simple-image-crud",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---

// 1. Upload Image
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }
        const { path, filename } = req.file; // 'filename' in CloudinaryStorage is the public_id usually
        const newImage = new Image({
            url: path,
            public_id: filename
        });
        await newImage.save();
        res.json({ message: "Image uploaded", image: newImage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get All Images
app.get("/images", async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Delete Image
app.delete("/images/:id", async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.public_id);

        // Delete from DB
        await Image.findByIdAndDelete(req.params.id);

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send({
        message: "Simple Image CRUD API",
        endpoints: {
            POST: "/upload (form-data: image)",
            GET: "/images",
            DELETE: "/images/:id"
        }
    });
});

const PORT = 3400;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




