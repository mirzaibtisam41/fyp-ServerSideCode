/**
 * Seeds the database with a first admin, a demo user, a category tree and a
 * sample catalog so the app is usable after the original data was lost.
 * Run with:  npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const {mongoURI} = require('./config/keys');
const {hashPassword} = require('./utils/password');

const adminModel = require('./models/adminModel');
const userModel = require('./models/userModel');
const categoryModel = require('./models/categoryModel');
const productModel = require('./models/productModel');

// Category tree: main -> [subs]. Products reference a sub-category name.
const CATEGORIES = {
  Electronics: ['Mobiles', 'Laptops', 'Audio'],
  Fashion: ["Men's TopWear", "Women's TopWear", 'Footwear'],
  'Home & Kitchen': ['CookWare', 'Furniture'],
};

// [name, parentSub, brand, price, offer, quantity, active]
const PRODUCTS = [
  ['Aurora X5 Smartphone', 'Mobiles', 'Aurora', 45000, 5000, '25', 'In Deal'],
  ['Aurora Lite 4G', 'Mobiles', 'Aurora', 22000, 0, '40', 'Active'],
  ['Nimbus Note 12', 'Mobiles', 'Nimbus', 32000, 3000, '15', 'In Deal'],
  ['Vertex Pro 14 Laptop', 'Laptops', 'Vertex', 135000, 15000, '10', 'In Deal'],
  ['Vertex Air 13', 'Laptops', 'Vertex', 98000, 0, '8', 'Active'],
  ['Nimbus BookLite', 'Laptops', 'Nimbus', 72000, 4000, '12', 'Active'],
  ['PulseBeat Wireless Earbuds', 'Audio', 'PulseBeat', 6500, 1000, '60', 'In Deal'],
  ['PulseBeat Over-Ear Headphones', 'Audio', 'PulseBeat', 12000, 0, '30', 'Active'],
  ['Everyday Cotton Tee', "Men's TopWear", 'Loomly', 1800, 300, '100', 'Active'],
  ['Classic Oxford Shirt', "Men's TopWear", 'Loomly', 3200, 0, '50', 'Active'],
  ['Breeze Summer Kurti', "Women's TopWear", 'Zara Bloom', 2400, 400, '70', 'In Deal'],
  ['Everyday Blouse', "Women's TopWear", 'Zara Bloom', 2100, 0, '45', 'Active'],
  ['Trailblaze Running Shoes', 'Footwear', 'Strider', 7800, 800, '35', 'In Deal'],
  ['Urban Canvas Sneakers', 'Footwear', 'Strider', 4500, 0, '55', 'Active'],
  ['5-Piece Non-Stick CookWare Set', 'CookWare', 'HearthCo', 8900, 900, '20', 'In Deal'],
  ['Stainless Steel Pan', 'CookWare', 'HearthCo', 2600, 0, '40', 'Active'],
  ['Nordic Oak Study Desk', 'Furniture', 'Timberly', 18500, 2000, '9', 'Active'],
  ['Cloud Lounge Chair', 'Furniture', 'Timberly', 24000, 3000, '6', 'In Deal'],
];

const sampleReviews = (email) => [
  {
    userID: null,
    userName: 'Demo User',
    userEmail: email,
    comment: 'Great value',
    detail: 'Exactly as described and arrived quickly. Very happy with it.',
    star: 5,
    date: new Date(),
  },
  {
    userID: null,
    userName: 'Demo User',
    userEmail: email,
    comment: 'Solid choice',
    detail: 'Good quality for the price. Would recommend to a friend.',
    star: 4,
    date: new Date(),
  },
];

const run = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log('Connected. Seeding…');

  await Promise.all([
    adminModel.deleteMany({}),
    userModel.deleteMany({}),
    categoryModel.deleteMany({}),
    productModel.deleteMany({}),
  ]);

  // Admin + demo user
  await adminModel.create({
    firstName: 'Site',
    lastName: 'Admin',
    email: 'admin@kartly.com',
    password: await hashPassword('admin123'),
  });
  const demoEmail = 'demo@kartly.com';
  await userModel.create({
    name: 'demo user',
    email: demoEmail,
    password: await hashPassword('demo123'),
    isLogedin: false,
  });

  // Categories (main + subs)
  const categoryDocs = [];
  Object.entries(CATEGORIES).forEach(([main, subs]) => {
    categoryDocs.push({name: main, slug: slugify(main, {lower: true})});
    subs.forEach((sub) =>
      categoryDocs.push({name: sub, slug: slugify(sub, {lower: true}), parent: main})
    );
  });
  await categoryModel.insertMany(categoryDocs);

  // Products
  const products = PRODUCTS.map(([name, parent, brand, price, offer, quantity, active], i) => ({
    name,
    slug: slugify(name, {lower: true}),
    price,
    offer,
    description: `${name} by ${brand}. A quality ${parent.toLowerCase()} product offered on Kartly with a reliable warranty and fast delivery.`,
    parent,
    brand,
    productPics: [], // empty -> the client shows its clean placeholder
    quantity,
    active,
    reviews: i % 3 === 0 ? sampleReviews(demoEmail) : [],
  }));
  await productModel.insertMany(products);

  console.log(`Seeded: 1 admin, 1 user, ${categoryDocs.length} categories, ${products.length} products.`);
  console.log('\nLogin credentials:');
  console.log('  Admin  ->  admin@kartly.com / admin123');
  console.log('  User   ->  demo@kartly.com  / demo123');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
