"use server";
import nextConnect from "next-connect";
import multer from "multer";

// Setup storage (for saving image locally in /public/uploads)
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

apiRoute.use(upload.single("image")); // 'image' is the field name in FormData

apiRoute.post((req, res) => {
  res.status(200).json({ message: "Image uploaded successfully!", file: req.file });
});

export default apiRoute;

// Disable body parser to allow multer to parse form-data
export const config = {
  api: {
    bodyParser: false,
  },
};
