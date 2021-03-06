import { Request, Response } from "express";
import knex from "../database/connection";

function parseItemIds(items: string): number[] {
  return String(items).split(",").map((item) => Number(item.trim()));
}

export default class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const query = knex("points").join("points-items", "points.id", "=", "points-items.point_id");

    if (items) query.whereIn("points-items.item_id", parseItemIds(String(items)));
    if (city) query.where("city", String(city));
    if (uf) query.where("uf", String(uf));

    const points = await query.distinct().select("points.*");

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.0.10:3333/public/${point.image}`
      }
    });

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();
    if (!point)
      return response.status(404).json({ message: "Point not found" });

    const items = await knex("items")
      .join("points-items", "items.id", "=", "points-items.item_id")
      .where("points-items.point_id", id)
      .select("title", "image");

    const serializedPoints = {
      ...point,
      image_url: `http://192.168.0.10:3333/public/${point.image}`,
      items
    };

    return response.json(serializedPoints);
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
      items,
    } = request.body;

    try {
      const trx = await knex.transaction();

      const point = {
        image: request.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };

      const insertedIds = await trx("points")
        .insert(point)
        .returning("id")
        .into("points");

      const point_id = insertedIds[0];

      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
          return {
            item_id,
            point_id
          };
        });

      await trx("points-items").insert(pointItems);

      await trx.commit();

      return response.status(201).json({
        success: true,
        data: {
          id: point_id,
          ...point,
        },
      });
    } catch (err) {
      return response.status(500).json({
        success: false,
        error: err,
      });
    }
  }
}
