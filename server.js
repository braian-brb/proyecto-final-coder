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
const router = Router();
app.use("/api", router);

//GET '/api/products' -> devuelve todos los products.
router.get("/products", async (req, res) => {
    res.json(await products.getAll());
});

//GET '/api/products/:id' -> devuelve un producto según su id.
router.get("/products/:id", async (req, res) => {
    res.json(await products.getById(req.params.id));
});

function isAdmin(req) {
    const isAdmin = req.params.boolean.toLocaleLowerCase() === "true";
    console.log(isAdmin);
    return isAdmin;
}

//POST '/api/products' ->
router.post("/products/:boolean", (req, res) => {
    if (isAdmin(req)) {
        products.save(req.body);
        res.json({ result: "Success" });
    } else res.json({ error: "Not authorized" });
});

//PUT '/api/products/:id' -> recibe y actualiza un producto según su id.
router.put("/products/:id/:boolean", async (req, res) => {
    if (isAdmin(req)) {
        await products.updateById(req.params.id, req.body);
        res.json({ result: "Success" });
    } else res.json({ error: "Not authorized" });
});

//DELETE '/api/products/:id' -> elimina un producto según su id.
router.delete("/products/:id/:boolean", async (req, res) => {
    if (isAdmin(req)) {
        await products.deleteById(req.params.id);
        res.json({ result: "Success" });
    } else res.json({ error: "Not authorized" });
});

// **************************************************************** CARRITO

const Cart = require("./carrito.js");
const carrito = new Cart();

//POST: '/' - Crea un carrito y devuelve su id.
router.post("/carrito", async (req, res) => {
    console.log(await carrito.createCart());
    res.send('sucess')
});
//DELETE: '/:id' - Vacía un carrito y lo elimina.
router.delete("/carrito/:id", async (req, res) => {
    res.send(await carrito.deleteCartById(req.params.id));
});
//GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
router.get("/carrito/:id/products", async (req, res) => {
    res.send(await carrito.getProducts(req.params.id));
});
//POST: '/:id/productos/:id_prod' - Para incorporar productos al carrito por su id de producto
router.post("/carrito/:id/products/:id_prod", async (req, res) => {
    
    await carrito.saveProduct(await products.getById(req.params.id_prod), req.params.id);
    res.send("sucess");
});
//DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
router.delete("/carrito/:id/products/:id_prod", (req, res) => {
    carrito.deleteProductById(req.params.id, req.params.id_prod);
    res.send("sucess");
});