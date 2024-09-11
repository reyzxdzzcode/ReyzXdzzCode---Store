import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    thumbnail: String,
    price: Number,
    category: String,
});

export default mongoose.model('Produk', productSchema);
