import { ContainerFile } from "../models/container.model.js";

class Products extends ContainerFile {
  constructor() {
    super("products.txt");
    this.binding();
  }

  async save(req, res) {
    req.body.timestamp = new Date().toLocaleString();
    await super.save(req.body);
    return res.status(201).json("Product created");
  }

  async getAll(req, res) {
    const products = await super.getAll();
    return res.status(200).json(products);
  }

  async getOne(req, res) {
    console.log(req.params.id);
    const product = await super.getOne(req.params.id);
    return res.status(200).json(product);
  }

  async getOneByCart(id) {
    console.log(id);
    const product = await super.getOne(id);
    return product;
  }

  async delete(req, res) {
    await super.delete(req.params.id);
    return res.status(200).json("Product deleted");
  }

  async update(req, res) {
    const product = await super.getOne(req.params.id);
    if (product) {
      const { name, description, code, thumbnail, price, stock } = req.body;
      await super.update(req.params.id, {
        name,
        description,
        code,
        thumbnail,
        price,
        stock,
      });
      return res.status(200).json("Product updated");
    } else {
      return res.status(404).json("Product not found");
    }
  }

  //binding
  async binding() {
    this.save = this.save.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }
}

export default Products;
