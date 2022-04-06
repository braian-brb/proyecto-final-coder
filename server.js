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

//GET '/api/products' -> devuelve todos los products.
productRoutes.get("/", async (req, res) => {
    res.json(await products.getAll());
});

//GET '/api/products/:id' -> devuelve un producto según su id.
productRoutes.get("/:id", async (req, res) => {
    res.json(await products.getById(req.params.id));
});

const middlewareIsAdmin = async (req, res, next) => {
    const isAdmin = req.params.boolean.toLocaleLowerCase();

    if (isAdmin === "true") {
        next();
    } else {
        res.json({ error: -1, descripcion: "ruta 'x' método 'y' no autorizada" });
    }
};

//PUT '/api/products/:id' -> recibe y actualiza un producto según su id.
productRoutes.put("/:id/:boolean", middlewareIsAdmin, async (req, res) => {
    //if (isAdmin(req)) {
    res.send(await products.updateById(req.params.id, req.body));
    //res.json({ result: "Success" });
    // } else res.json({ error: "Not authorized" });
});

//DELETE '/api/products/:id' -> elimina un producto según su id.
productRoutes.delete("/:id/:boolean", middlewareIsAdmin, async (req, res) => {
    //if (isAdmin(req)) {
    res.send(await products.deleteById(req.params.id));
    //   res.json({ result: "Success" });
    //} else res.json({ error: "Not authorized" });
});

//POST '/api/products' ->
productRoutes.post("/:boolean", middlewareIsAdmin, async (req, res) => {
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
cartRouter.post("/carrito", async (req, res) => {
    console.log(await carrito.createCart());
    res.send("sucess");
});
//DELETE: '/:id' - Vacía un carrito y lo elimina.
cartRouter.delete("/carrito/:id", async (req, res) => {
    res.send(await carrito.deleteCartById(req.params.id));
});
//GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
cartRouter.get("/carrito/:id/products", async (req, res) => {
    res.send(await carrito.getProducts(req.params.id));
});
//POST: '/:id/productos/:id_prod' - Para incorporar productos al carrito por su id de producto
cartRouter.post("/carrito/:id/products/:id_prod", async (req, res) => {
    await carrito.saveProduct(await products.getById(req.params.id_prod), req.params.id);
    res.send("sucess");
});
//DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
cartRouter.delete("/carrito/:id/products/:id_prod", (req, res) => {
    carrito.deleteProductById(req.params.id, req.params.id_prod);
    res.send("sucess");
});
