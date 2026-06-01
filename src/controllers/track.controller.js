import { cloudinary } from '../config/cloudinary.js';
import { Track } from '../models/track.model.js';

const uploadAudioToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                folder: 'audlist/tracks',
            },
            (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            },
        );

        uploadStream.end(fileBuffer);
    });
};

export const createTrack = async (req, res, next) => {
    try {
        const { title, durationSec, previewStartSec, previewDurationSec } = req.body || {};

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Audio file is required' });
        }

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const parsedDurationSec = Number(durationSec);

        if (!Number.isFinite(parsedDurationSec) || parsedDurationSec < 1) {
            return res.status(400).json({ success: false, message: 'durationSec must be at least 1' });
        }

        const uploadResult = await uploadAudioToCloudinary(req.file.buffer);

        const track = await Track.create({
            artist: req.user.user_Id,
            title,
            durationSec: parsedDurationSec,
            audioUrl: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            },
            previewStartSec,
            previewDurationSec,
        });

        return res.status(201).json({ success: true, data: track });
    } catch (err) {
        next(err);
    }
};
