import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
        type: { type: String, enum: ['single', 'album', 'merch'], required: true },
        title: { type: String, trim: true, required: true },
        slug: { type: String, unique: true, lowercase: true, trim: true, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        minPrice: { type: Number, required: true, min: 0 },
        coverUrl: { type: String , default: '/covers/default-cover.jpg'},
        nameYourPrice: { type: Boolean, default: false },
        releasedDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published'},
        deletedAt: { type: Date, default: null}
    } , { timestamps: true },
)

export const Product = mongoose.model('Products', productSchema);