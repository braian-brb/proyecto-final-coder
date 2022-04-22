import { ContainerFile } from "../models/container.model.js";
import { products } from "../routes/products.routes.js";

class Carts extends ContainerFile {
  constructor() {
    super("carts.txt");
    this.binding();
  }

  async getAll(req, res) {
    try {
      const objs = await super.getAll();
      return res.status(200).json(objs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async createCart(req, res) {
    req.body.timestamp = new Date().toLocaleString();
    req.body.products = [];
    await super.save(req.body);
    return res.status(201).json("Cart created");
  }

  async saveProduct(req, res) {
    const { id_prod, id_cart } = req.params;
    const productFind = await products.getOneByCart(id_prod);
    const carts = await super.getAll();
    const cartFind = carts.find((cart) => cart.id === req.params.id);
    productFind.timestamp = new Date().toLocaleString();
    cartFind.products.push(productFind);
    super.saveSerialized(carts);

    return res.status(201).json({ ProductSaved: productFind });
  }

  async getProducts(req, res) {
    const carts = await super.getAll();
    const cartFind = carts.find((cart) => cart.id === req.params.id);
    return res.status(200).json(cartFind.products);
  }

  async deleteCartById(req, res) {
    await super.delete(req.params.id);
    return res.status(200).json("Cart deleted");
  }

  async deleteProductById(req, res) {
    const carts = await super.getAll();
    const cartFind = carts.find((cart) => cart.id === req.params.id);
    const productFind = cartFind.products.find(
      (product) => product.id === req.params.id
    );
    cartFind.products.splice(cartFind.products.indexOf(productFind), 1);
    await super.save(cartFind);
    return res.status(200).json("Product deleted");
  }

  //binding
  binding() {
    this.createCart = this.createCart.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.deleteCartById = this.deleteCartById.bind(this);
    this.deleteProductById = this.deleteProductById.bind(this);
    this.save = this.save.bind(this);
    this.getAll = this.getAll.bind(this);
  }
}

export default Carts;
