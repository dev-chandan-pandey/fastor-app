import { Router } from 'express';
import { listProducts, listCategories } from '../controllers/productController.js';
const router = Router();
router.get('/', listProducts); router.get('/categories', listCategories);
export default router;
