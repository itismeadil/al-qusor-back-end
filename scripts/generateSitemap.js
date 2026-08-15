/**
 * Dynamic Sitemap Generator for Al Qusor
 * 
 * This script generates a sitemap.xml that includes all products from the database.
 * Run this script after adding/updating products: node scripts/generateSitemap.js
 * 
 * Copy the generated sitemap.xml to your frontend public folder.
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const BASE_URL = process.env.SITE_URL || 'https://your-actual-vercel-url.vercel.app';

async function generateSitemap() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fetch all products
    const products = await Product.find({}).select('_id updatedAt');
    console.log(`Found ${products.length} products`);

    // Generate sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Product Pages -->
  ${products.map(product => {
    const lastmod = product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${BASE_URL}/p/${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n')}
</urlset>`;

    // Write to file
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '../../al-qusor-front-end/public/sitemap.xml');
    
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated successfully at: ${outputPath}`);
    console.log(`Total URLs: ${products.length + 1} (1 homepage + ${products.length} products)`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();