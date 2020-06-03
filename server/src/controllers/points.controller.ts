import { Request, Response } from "express";
import knex from "../database/connection";

export default class PointsController {
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();
        if (!point) return response.status(404).json({ message: 'Point not found' });

        const items = await knex('items')
            .join('points-items', 'items.id', '=', 'points-items.item_id')
            .where('points-items.point_id', id)
            .select('title', 'image');

        return response.json({
            ...point,
            items
        });
    }

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

            const point = {
                image: 'image-fake',
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            };

            const insertedIds = await trx('points')
                .insert(point)
                .returning("id")
                .into("points");

            const point_id = insertedIds[0];

            const pointItems = items.map((item_id: number) => {
                return { item_id, point_id };
            });

            await trx('points-items').insert(pointItems);

            trx.commit();

            return response.status(201).json({
                success: true,
                data: {
                    id: point_id,
                    ...point
                }
            });
        }
        catch (err) {
            return response.status(500).json({
                success: false,
                error: err
            });
        }

    }
}
