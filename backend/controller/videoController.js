import Video from '../models/video.js';

export const uploadVideo = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No video file provided' });

    const video = await Video.create({
      title,
      course: courseId,
      videoUrl: req.file.path,
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
