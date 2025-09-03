const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 KPH Server is running!');
});

// Dynamic port for Render or local
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const upload = multer({ dest: uploadDir });

// In-memory store for thumbnail experiments
const experiments = {};

// -------------------
// Image Converter API
// -------------------
app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    const format = req.query.format || 'jpg';
    const inputPath = req.file.path;
    const outputPath = path.join(uploadDir, `converted-${Date.now()}.${format}`);

    await sharp(inputPath).toFormat(format).toFile(outputPath);

    res.download(outputPath, (err) => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// ------------------------
// Thumbnail A/B Tester API
// ------------------------

// Create experiment
app.post('/experiment', (req, res) => {
  const { videoId, thumbnails } = req.body;
  if (!videoId || !thumbnails || !thumbnails.length)
    return res.status(400).json({ error: 'Missing videoId or thumbnails' });

  experiments[videoId] = {};
  thumbnails.forEach((t) => (experiments[videoId][t] = 0));

  res.json({ message: 'Experiment created', experiment: experiments[videoId] });
});

// Get random thumbnail
app.get('/thumbnail/:videoId', (req, res) => {
  const { videoId } = req.params;
  const thumbs = experiments[videoId];
  if (!thumbs) return res.status(404).json({ error: 'Experiment not found' });

  const keys = Object.keys(thumbs);
  const chosen = keys[Math.floor(Math.random() * keys.length)];
  thumbs[chosen] += 1;

  res.json({ thumbnail: chosen });
});

// Get results
app.get('/results/:videoId', (req, res) => {
  const { videoId } = req.params;
  const thumbs = experiments[videoId];
  if (!thumbs) return res.status(404).json({ error: 'Experiment not found' });

  res.json(thumbs);
});

// ------------------------
// Start Server
// ------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
