import {Router} from "express";
import { verifyJwt } from "../middlewares/authentication.middelware.js";
import { createProduct, deleteProduct, getAllProducts, getFavouriteProducts, getSingleProduct, searchProducts, toggleFavourite, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.route('/createProduct').post(verifyJwt , createProduct)
router.route('/getSingleProduct/:productId').get(verifyJwt , getSingleProduct)
router.route('/updateProduct/:productId').put(verifyJwt , updateProduct)
router.route('/deleteProduct/:productId').delete(verifyJwt , deleteProduct)
router.route('/searchProducts').get(verifyJwt , searchProducts)
router.route('/getAllProducts').get(verifyJwt , getAllProducts)
router.route('/toggleFavourite/:productId').post(verifyJwt , toggleFavourite)
router.route('/getFavouriteProducts').get(verifyJwt , getFavouriteProducts)

export default router;