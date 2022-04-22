import fs from "../utils/fs.js";
export class ContainerFile {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, "[]");
  }

  async getAll() {
    try {
      const objs = JSON.parse(fs.readFileSync(this.path, "utf8"));
      return objs;
    } catch (error) {
      console.log(error);
    }
  }

  async getOne(id) {
    const objs = JSON.parse(fs.readFileSync(this.path, "utf8"));
    const search = objs.find((obj) => obj.id == id);
    return search;
  }

  async save(obj) {
    try {
      const objs = JSON.parse(fs.readFileSync(this.path, "utf8"));
      obj.id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      objs.push(obj);
      fs.writeFileSync(this.path, JSON.stringify(objs, null, 2));
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async saveSerialized(obj) {
    try {
      const objSerialized = JSON.stringify(obj, null, 2);
      this.fs.writeFileSync(this.path, objSerialized);
      return obj;
    } catch (error) {
      return false;
    }
  }

  async delete(id) {
    try {
      const objs = JSON.parse(fs.readFileSync(this.path, "utf8"));
      const newObjs = objs.filter((obj) => obj.id != id);
      fs.writeFileSync(this.path, JSON.stringify(newObjs, null, 2));
      return newObjs;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, obj) {
    const objs = JSON.parse(fs.readFileSync(this.path, "utf8"));
    const objsFind = objs.findIndex((e) => e.id == id);
    if (objsFind != -1) {
      obj.id = objs[objsFind].id;
      (obj.timestamp = new Date().toLocaleString()), (objs[objsFind] = obj);
      fs.writeFileSync(this.path, JSON.stringify(objs, null, 2));
      return obj;
    } else return { error: "Product not found" };
  }
}

export default ContainerFile;
