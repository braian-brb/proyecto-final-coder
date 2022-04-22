import express from "express";
import morgan from "morgan";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { isAdmin, routeExists } from "./middlewares/index.js";

const app = express();

//settings
app.set("port", process.env.PORT || 3000);
//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//middlewares
app.use(morgan("dev"));
app.use(isAdmin);
app.use(routeExists);

export default app;
