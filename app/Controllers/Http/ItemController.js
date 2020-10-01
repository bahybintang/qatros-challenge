"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/framework/src/Params')} Params */

const Validator = use("Validator");
const Item = use("App/Models/Item");

/**
 * Resourceful controller for interacting with items
 */
class ItemController {
  /**
   * Show a list of all items.
   * GET items
   *
   * @param {object} ctx
   */
  async index() {
    const items = await Item.all();
    return items.rows;
  }

  /**
   * Create/save a new item.
   * POST items
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const rules = {
      name: "required|unique:items,name",
      description: "required",
    };

    const validation = await Validator.validate(request.all(), rules);
    if (validation.fails()) {
      return response.status(400).json(validation.messages());
    }

    const newItem = await Item.create({
      ...request.all(),
      code: await Item.generateCode(),
    });

    return newItem;
  }

  /**
   * Display a single item.
   * GET items/:id
   *
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    const item = await Item.find(params.code);
    if (!item) return response.status(400).json({ message: "Item not found!" });
    return item;
  }

  /**
   * Update item details.
   * PUT or PATCH items/:id
   *
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      name: "required|unique:items,name",
      description: "required",
    };

    const validation = await Validator.validate(request.all(), rules);
    if (validation.fails()) {
      return response.status(400).json(validation.messages());
    }

    const item = await Item.find(params.code);
    if (!item) return response.status(400).json({ message: "Item not found!" });

    item.name = request.all().name;
    item.description = request.all().description;
    await item.save();

    return item;
  }

  /**
   * Delete a item with id.
   * DELETE items/:id
   *
   * @param {object} ctx
   * @param {Params} ctx.params
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const item = await Item.find(params.code);
    if (!item) return response.status(400).json({ message: "Item not found!" });
    await item.delete();
    return item;
  }

  /**
   * Find items by code or name
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async find({ request, response }) {
    const rules = {
      keyword: "required",
    };

    const validation = await Validator.validate(request.all(), rules);
    if (validation.fails()) {
      return response.status(400).json(validation.messages());
    }

    const items = await Item.query()
      .where("code", "like", `%${request.all().keyword}%`)
      .orWhere("name", "like", `%${request.all().keyword}%`)
      .fetch();

    return items;
  }
}

module.exports = ItemController;
