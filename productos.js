class Productos {
    constructor() {}
    path = "productList.txt";
    static id = 1;
    fs = require("fs");

    async save(product) {
        //save(Object): Number - Recibe un objeto, lo guarda en el archivo
        try {
            if (!this.fs.existsSync(this.path)) await this.fs.promises.writeFile(this.path, "[]");

            const productsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
            if (productsList.length == 0) {
            } else {
                Productos.id = productsList[productsList.length - 1].id + 1;
            }

            product.id = Productos.id;
            product.timestamp = Date.now();
            Productos.id++;

            /*  if ( productsList.length === 0) product["id"] = Productos.id, Productos.id++;
            else product["id"] = productsList[productsList.length - 1].id + 1   */
            productsList.push(product);
            const productsListSerialized = JSON.stringify(productsList, null, 2);
            await this.fs.promises.writeFile(this.path, productsListSerialized);
        } catch (error) {
            console.log(error);
        }
    }

    async getById(idParameter) {
        //getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const productsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
            const productFind = productsList.find((e) => e.id == idParameter);

            if (productFind != undefined) return productFind;
            else return null;
        } catch (err) {
            console.log(err);
        }
    }

    async getAll() {
        // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        const productsList = JSON.parse(await this.fs.promises.readFile("productList.txt", "utf-8"));
        console.log(productsList);
        return productsList;
    }

    async deleteById(idParameter) {
        //deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try {
            const productsList = JSON.parse(await this.fs.promises.readFile(this.path, "utf-8"));
            const productFindIndex = productsList.findIndex((e) => e.id == idParameter);
            productsList.splice(productFindIndex, 1);
            const productsListSerialized = JSON.stringify(productsList, null, 2);
            await this.fs.promises.writeFile(this.path, productsListSerialized);
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

    async updateById(idParameter, updateProduct) {
        //updateById(Number): Actualiza un producto segun su id}

        const productsList = JSON.parse(await this.fs.promises.readFile("productList.txt", "utf-8"));

        const productFindIndex = productsList.findIndex((e) => e.id == idParameter);

        if (productFindIndex != -1) {
            updateProduct.id = parseInt(idParameter);
            updateProduct.timestamp = new Date().toLocaleString(),
            productsList[productFindIndex] = updateProduct;
            const productsListSerialized = JSON.stringify(productsList, null, 2);
            await this.fs.promises.writeFile(this.path, productsListSerialized);
            return updateProduct;
        } else return { error: "Product not found" };
    }
}

module.exports = Productos;
