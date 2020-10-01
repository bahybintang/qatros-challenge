"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Crypto = require("crypto");

class Item extends Model {
  static get incrementing() {
    return false;
  }

  static get primaryKey() {
    return "code";
  }

  static async generateCode() {
    let code = Crypto.randomBytes(12).toString("hex").slice(0, 12);
    while (!!(await this.find(code))) {
      code = Crypto.randomBytes(12).toString("hex").slice(0, 12);
    }
    return code;
  }
}

module.exports = Item;
