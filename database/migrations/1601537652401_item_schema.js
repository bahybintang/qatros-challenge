"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ItemSchema extends Schema {
  up() {
    this.create("items", (table) => {
      table.string("code", 12).primary();
      table.string("name").notNullable().unique();
      table.string("description");
      table.timestamps();
    });
  }

  down() {
    this.drop("items");
  }
}

module.exports = ItemSchema;
