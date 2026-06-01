import { Track } from '../models/track.model.js';






// export const createTrack = async (req, res, next) => {
//     try {
//         const { title, previewStartSec, previewDurationSec } = req.body || {};

//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'Audio file is required' });
//         }

//         if (!title) {
//             return res.status(400).json({ success: false, message: 'Title is required' });
//         }

//         const uploadResult = await uploadAudioToCloudinary(req.file.buffer);
//         const durationSec = Math.ceil(uploadResult.duration);

//         if(!Number.isFinite(durationSec) || durationSec < 5){
//             return res.status(400).json({ success:false,message:'Could not read audio duration'})
//         }
//         const parsedPreviewStartSec = previewStartSec === undefined ? 30 : Number(previewStartSec);
//         const parsedPreviewDurationSec = previewDurationSec === undefined ? 30 : Number(previewDurationSec);

//         const track = await Track.create({
//             artist: req.user.user_Id,
//             title,
//             durationSec,
//             audioUrl: {
//                 public_id: uploadResult.public_id,
//                 url: uploadResult.secure_url,
//             },
//             previewStartSec: parsedPreviewStartSec,
//             previewDurationSec: parsedPreviewDurationSec,
//         });

//         return res.status(201).json({
//             success: true,
//             data: { ...track.toJSON(), previewUrl: buildPreviewUrl(track.audioUrl.public_id, track.previewStartSec, track.previewDurationSec,), },
//         });
//     } catch (err) {
//         next(err);
//     }
// };
