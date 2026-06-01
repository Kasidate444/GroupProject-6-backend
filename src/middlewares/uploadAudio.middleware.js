import multer from 'multer';

const allowedAudioTypes = new Set([
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
]);

export const uploadAudio = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (allowedAudioTypes.has(file.mimetype)) {
            return cb(null, true);
        }

        return cb(new Error('Only audio files are allowed'));
    },
});
