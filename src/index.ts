import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();
const app = fastify();

app.get('/', async (request, reply) => {
  const allUsers = await prisma.users.findMany();
  
  return JSON.parse(JSON.stringify(allUsers, (_, value) => typeof value === "bigint"
    ? value.toString()
    : value
  ));
});

app.listen({
  port: 3000
}).then(() => console.log('Server is running on http://localhost:3000'));