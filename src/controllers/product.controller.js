import { Product } from '../models/product.model.js'

export const getAllProductInfo = async (req, res, next) => {
    try {
        const product = await Product.find();

        return res.status(200).json({ success: true, data: product });
    }
    catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        return res.status(200).json({ success: true, data: product });
    }
    catch (err) {
        next(err);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { type,title,description,price,minPrice,coverUrl,nameYourPrice,releasedDate} = req.body || {};
        const product = await Product.create({artist: req.user.user_Id,type,title, slug:title,description,price,minPrice,coverUrl,nameYourPrice,releasedDate,status});

        return res.status(201).json({ success:true,data: product});

    }catch(err){
        next(err)
    }
}