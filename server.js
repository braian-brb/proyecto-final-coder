// ****************************** SERVER
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Listing in port ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error in server ${error}`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const Productos = require("./productos.js");

const products = new Productos();

const { Router } = express;
const productRoutes = Router();
app.use("/api/products", productRoutes);

const middlewareIsAdmin = (req, res, next) => {
    const admin = true;
    if (admin) {
        next();
    } else {
        res.json({ error: -1, descripcion: "ruta 'x' método 'y' no autorizada" });
    }
};

//GET '/api/products' -> devuelve todos los products.
productRoutes.get("/", async (req, res) => {
    res.json(await products.getAll());
});

//GET '/api/products/:id' -> devuelve un producto según su id.
productRoutes.get("/:id", async (req, res) => {
    res.json(await products.getById(req.params.id));
});

//PUT '/api/products/:id' -> recibe y actualiza un producto según su id.
productRoutes.put("/:id", middlewareIsAdmin, async (req, res) => {
    res.json(await products.updateById(req.params.id, req.body));
});

//DELETE '/api/products/:id' -> elimina un producto según su id.
productRoutes.delete("/:id", middlewareIsAdmin, async (req, res) => {
    res.json({ delete: await products.deleteById(req.params.id) });
});

//POST '/api/products' ->
productRoutes.post("/", middlewareIsAdmin, async (req, res) => {
    products.save(req.body);
    res.redirect("/");
});

// **************************************************************** CARRITO
const cartRouter = Router();
app.use("/api/carrito", cartRouter);
const Cart = require("./carrito.js");
//const e = require("express");
const carrito = new Cart();

//POST: '/' - Crea un carrito y devuelve su id.
cartRouter.post("/", async (req, res) => {
    res.json({ id: await carrito.createCart() });
});
//DELETE: '/:id' - Vacía un carrito y lo elimina.
cartRouter.delete("/:id", async (req, res) => {
    res.json({ Carts: await carrito.deleteCartById(req.params.id) });
});
//GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
cartRouter.get("/:id/products", async (req, res) => {
    res.json({ products: await carrito.getProducts(req.params.id) });
});
//POST: '/:id/productos/:id_prod' - Para incorporar productos al carrito por su id de producto
cartRouter.post("/:id/products/:id_prod", async (req, res) => {
    res.json({ Cart: await carrito.saveProduct(await products.getById(req.params.id_prod), req.params.id) });
});
//DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
cartRouter.delete("/:id/products/:id_prod", (req, res) => {
    res.json({ delete: carrito.deleteProductById(req.params.id, req.params.id_prod) });
});
