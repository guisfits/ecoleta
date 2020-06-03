import { Request, Response } from "express";
import knex from "../database/connection";

export default class ItemsController {
    async Get(request: Request, response: Response) {
        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                name: item.title,
                image_url: `http://localhost:3333/${item.image}`
            };
        })

        return response.json(serializedItems);
    }
}
