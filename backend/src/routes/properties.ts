// src/routes/properties.ts

import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const propertyRoutes = new Hono();

// POST /api/properties
propertyRoutes.post('/', async (c) => {
  try {
    const data = await c.req.json();

    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        size: data.size,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        address: data.address,
        city: data.city,
        propertyType: data.propertyType,
        listingType: data.listingType,
        ownerId: data.ownerId,
      },
    });

    return c.json(property, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to add property' }, 500);
  }
});
// GET /api/properties
propertyRoutes.get("/", async (c) => {
  const properties = await prisma.property.findMany();
  return c.json(properties);
});



export default propertyRoutes;
