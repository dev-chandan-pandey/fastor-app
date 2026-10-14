import { connectDatabase } from './config/db.js';
import { Product } from './models/Product.js';
const foods = [
['shake','Strawberry Shake','Creamy strawberry milkshake',120,4.8,'10–15 min','https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85','Shakes',true],
['burger','Chicken Burger','Crispy chicken, fresh lettuce',189,4.7,'20–25 min','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85','Burgers',false],
['sushi','Sushi Wave','A fresh, chef-curated sushi roll',249,4.9,'25–30 min','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=85','Sushi',false],
['pizza','Garden Veg Pizza','Classic cheese with garden veggies',299,4.8,'20–30 min','https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85','Pizza',true],
['salad','Green Goddess Bowl','Crunchy greens, avocado and seeds',179,4.6,'15–20 min','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85','Healthy',true],
['fries','Loaded Peri Fries','Golden fries with spicy seasoning',109,4.5,'12–18 min','https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85','Sides',true],
['pasta','Creamy Pesto Pasta','Basil pesto, parmesan and herbs',229,4.7,'20–25 min','https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85','Pasta',true],
['sandwich','Grilled Club Sandwich','Toasted bread, cheese and greens',159,4.6,'15–20 min','https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=85','Snacks',true],
].map(([slug,name,description,price,rating,time,image,category,veg])=>({slug,name,description,price,rating,time,image,category,veg,available:true}));
try { await connectDatabase(); await Product.bulkWrite(foods.map(food => ({ updateOne: { filter: { slug: food.slug }, update: { $set: food }, upsert: true } }))); console.log(`Seeded ${foods.length} products`); process.exit(0); } catch (e) { console.error(e); process.exit(1); }
