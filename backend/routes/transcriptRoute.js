const express = require('express');
const router = express.Router();
const Transcript = require('../models/transcriptModel');

router.get('/:mssv', async (req, res) => {
  try {
    const transcripts = await Transcript.find({ studentId: req.params.mssv });
    res.json(transcripts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;