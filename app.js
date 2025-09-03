// app.js
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

/* ----------------------------
   IMAGE CONVERTER API
-----------------------------*/

// POST /convert?format=jpg|png|webp
app.post("/convert", upload.single("image"), async (req, res) => {
  try {
    const format = req.query.format; // requested format
    if (!req.file) return res.status(400).send("No file uploaded");
    if (!["jpg", "png", "webp"].includes(format))
      return res.status(400).send("Invalid format (use jpg, png, webp)");

    const inputPath = req.file.path;
    const outputPath = `uploads/converted-${Date.now()}.${format}`;

    // Convert using sharp
    await sharp(inputPath).toFormat(format).toFile(outputPath);

    // Send back converted file
    res.download(outputPath, (err) => {
      fs.unlinkSync(inputPath); // delete input file
      fs.unlinkSync(outputPath); // delete output file
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error converting image");
  }
});

/* ----------------------------
   THUMBNAIL A/B TESTER API
-----------------------------*/

const experiments = {}; // in-memory store

// Create experiment
app.post("/experiment", (req, res) => {
  const { videoId, thumbnails } = req.body;
  if (!videoId || !thumbnails || !Array.isArray(thumbnails)) {
    return res.status(400).send("videoId and thumbnails[] required");
  }

  experiments[videoId] = {
    thumbnails,
    stats: thumbnails.reduce((acc, t) => {
      acc[t] = 0;
      return acc;
    }, {}),
  };

  res.json({ message: "Experiment created", experiment: experiments[videoId] });
});

// Get a thumbnail (random selection)
app.get("/thumbnail/:videoId", (req, res) => {
  const { videoId } = req.params;
  const exp = experiments[videoId];
  if (!exp) return res.status(404).send("Experiment not found");

  const randomThumb =
    exp.thumbnails[Math.floor(Math.random() * exp.thumbnails.length)];
  exp.stats[randomThumb]++;

  res.json({ thumbnail: randomThumb });
});

// Get experiment results
app.get("/results/:videoId", (req, res) => {
  const { videoId } = req.params;
  const exp = experiments[videoId];
  if (!exp) return res.status(404).send("Experiment not found");

  res.json(exp.stats);
});

/* ----------------------------
   SERVER START
-----------------------------*/

// Root route (for testing in browser)
app.get("/", (req, res) => {
  res.send("✅ Server is running. Available routes: /convert, /experiment, /thumbnail/:videoId, /results/:videoId");
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
