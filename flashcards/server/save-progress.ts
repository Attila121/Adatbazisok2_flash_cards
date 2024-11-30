import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PROGRESS_FILE = path.join(__dirname, 'progress.json');

// Initialize progress file if it doesn't exist
if (!fs.existsSync(PROGRESS_FILE)) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({}));
}

// Save progress endpoint
app.post('/api/save-progress', (req, res) => {
  try {
    const progress = req.body;
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get progress endpoint
app.get('/api/get-progress', (req, res) => {
  try {
    const progress = fs.readFileSync(PROGRESS_FILE, 'utf-8');
    res.json(JSON.parse(progress));
  } catch (error) {
    console.error('Error reading progress:', error);
    res.status(500).json({ error: 'Failed to read progress' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});