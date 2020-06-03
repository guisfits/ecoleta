import { Request, Response } from "express";
import knex from "../database/connection";

export default class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        try {
            const trx = await knex.transaction();

            const insertedIds = await trx('points')
                .insert({
                    image: 'image-fake',
                    name,
                    email,
                    whatsapp,
                    latitude,
                    longitude,
                    city,
                    uf
                })
                .returning("id")
                .into("points");

            const point_id = insertedIds[0];

            const pointItems = items.map((item_id: number) => {
                return { item_id, point_id };
            });

            await trx('points-items').insert(pointItems);

            return response.status(201).json({ success: true });
        }
        catch (err) {
            return response.status(500).json({ success: false, error: err });
        }

    }
}