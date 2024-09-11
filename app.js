// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Product from './models/product.js';
import fs from 'fs';
const app = express();
const PORT = 3000;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Connect to MongoDB
mongoose.connect('mongodb+srv://alanqwerty:qwerty123@cluster0.cjvb1q8.mongodb.net/mydatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Failed to connect to MongoDB", err));

// Serve the homepage
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.resolve('./views/index.html'));
    } catch (error) {
        res.status(500).send("Error loading homepage: " + error.message);
    }
});

app.get('/admin/zans/piwpiw', async (req, res) => {
    try {
        res.sendFile(path.resolve('./views/admin.html'));
    } catch (e) {
        res.status(500).send("Error loading admin panel: " + e.message);
    }
});

// Fetch products by category
app.get('/products', async (req, res) => {
    const category = req.query.category;
    try { 
      if (category.includes("all")) {
        const products = await Product.find({});
        console.log(products)
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(products);
      } else {
        const products = await Product.find({category});
        console.log(products)
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(products);
      }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products: ' + error.message });
    }
});

// Search products
app.get('/products/search', async (req, res) => {
    const query = req.query.query;
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error searching products: ' + error.message });
    }
});

app.post('/admin/add-product', async (req, res) => {
    try {
        const { name, description, url, thumbnail, price, category } = req.body;
        const newProduct = new Product({ name, description, url, thumbnail, price, category });
        await newProduct.save();
        res.json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).send("Error adding product: " + error.message);
    }
});

// Remove a product
app.post('/admin/remove-product', async (req, res) => {
    try {
        const { name } = req.body;
        await Product.deleteOne({ name });
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).send("Error removing product: " + error.message);
    }
});

app.get('/detail/:name', async (req, res) => {
  const productName = req.params.name;
  try {
    const product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('productdetail', {product});
  } catch (error) {
    res.status(500).send('Error fetching product details' + error);
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
