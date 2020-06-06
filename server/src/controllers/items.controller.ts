import { Request, Response } from "express";
import knex from "../database/connection";

export default class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        name: item.title,
        image_url: `http://192.168.0.10:3333/public/${item.image}`,
      };
    });

    return response.json(serializedItems);
  }
}
