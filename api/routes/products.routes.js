import express from "express";
import Products from "../controllers/products.controller.fs.js";

const router = express.Router();
export const products = new Products();

router.use(express.json());

router.get("/", products.getAll); //
router.get("/:id", products.getOne); //
router.post("/", products.save); //
router.delete("/:id", products.delete); //
router.patch("/:id", products.update); //

export default router;

/* 

    {
        "name": "Product 1",
        "description": " Product 1 description",
        "code": "P1",
        "thumbnail": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        "price": "100"
        "stock": "10"
    }


*/
