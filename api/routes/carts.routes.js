import express from "express";
import Carts from "../controllers/carts.controller.fs.js";

const router = express.Router();
const carts = new Carts();

router.use(express.json());

router.post("/", carts.createCart); //
router.post("/:id/products/:id_prod", carts.saveProduct); //
router.get("/:id/products", carts.getProducts); //
router.get("/", carts.getAll); //
router.delete("/:id", carts.deleteCartById); //

export default router;
