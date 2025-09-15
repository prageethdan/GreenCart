import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/Product.js';
import fs from "fs";



export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    if (!productData || !images?.length) {
      return res.status(400).json({ success: false, message: "Missing product data or images" });
    }

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
        fs.unlinkSync(image.path); // cleanup
        return result.secure_url;
      })
    );

    await Product.create({
      ...productData,
      Image: imagesUrl, // match schema field name
      category: productData.category, // ✅ This is a string!
    });

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error fetching product list:", error);
        res.json({ success: false, message: "Internal server error" });
        }
}

export const productById = async (req, res) => {
    try {

        const {id} = req.body
        const product = await Product.findById(id);
        res.json({success: true, products});
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.json({ success: false, message: "Internal server error" });
    }

}

export const changeStock = async (req, res) => {
    try{
        const {id, inStock} = req.body;
        await Product.findByIdAndUpdate(id, {inStock});
        res.json({success: true, message: "Stock updated successfully"});
    }catch (error) {
        console.error("Error updating stock:", error);
        res.json({ success: false, message: "Internal server error" });
    }
  
}
