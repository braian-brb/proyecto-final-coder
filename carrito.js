class Cart {
    constructor() {
        if (!this.fs.existsSync(this.path)) {
            this.fs.writeFileSync(this.path, "[]");
        }
    }
    path = "Cart.txt";
    static id = 1;
    fs = require("fs");

    async createCart() {
        try {
            //if (!this.fs.existsSync(this.path)) await this.fs.promises.writeFile(this.path, "[]");
            const cartsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
            if (cartsList.length == 0) {
            } else {
                Cart.id = cartsList[cartsList.length - 1].id + 1;
            }
            const carrito = {
                id: Cart.id,
                timestampCart: new Date().toLocaleString(),
                products: [],
            };
            Cart.id++;
            cartsList.push(carrito);
            const cartsListSerialized = JSON.stringify(cartsList, null, 2);
            await this.fs.promises.writeFile(this.path, cartsListSerialized);
            return carrito.id;
        } catch (error) {
            console.log(error);
        }
    }

    async saveProduct(product, idParameter) {
        const cartsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
        const cartsFind = cartsList.find((e) => e.id == parseInt(idParameter));
        product.timestampProduct = new Date().toLocaleString()
        cartsFind.products.push(product);

        const cartsListSerialized = JSON.stringify(cartsList, null, 2);
        await this.fs.promises.writeFile(this.path, cartsListSerialized);

        return console.log(cartsFind);
    }

    async getProducts(idParameter) {
        const cartsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
        const cartsFind = cartsList.find((e) => e.id == parseInt(idParameter));
        console.log(cartsFind.products);
        return cartsFind.products;
    }

    async deleteCartById(idParameter) {
        //deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try {
            const cartsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
            const cartFindIndex = cartsList.findIndex((e) => e.id == idParameter);
            cartsList.splice(cartFindIndex, 1);
            const cartsListSerialized = JSON.stringify(cartsList, null, 2);
            await this.fs.promises.writeFile(this.path, cartsListSerialized);
            return cartsList;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProductById(idCart, idProduct) {
        //deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try {
            const cartsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
            const cartsFind = cartsList.find((e) => e.id == parseInt(idCart));

            const productFindIndex = cartsFind.products.findIndex((e) => e.id == parseInt(idProduct))

            cartsFind.products.splice(productFindIndex, 1);
            console.log(cartsFind);
            const cartsListSerialized = JSON.stringify(cartsList, null, 2);
            await this.fs.promises.writeFile(this.path, cartsListSerialized);
            return cartsFind;
        } catch (error) {
            console.log(error);
        }
    }



    async deleteAll() {
        //deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try {
            await this.fs.promises.writeFile(this.path, "[]");
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Cart;
