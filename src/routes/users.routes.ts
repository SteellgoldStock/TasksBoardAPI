import { RouteOptions } from 'fastify/types/route';
import { app } from '..';
import prisma, { patch } from '../utils/prisma';

/** GET ALL USERS */
app.route({
  method: 'GET',
  url: '/users/:secret_key',
  handler: async (request: any, reply) => {
    if (request.params.secret_key !== process.env.SECRET_TOKEN) {
      reply.code(401).send({ message: 'Unauthorized' });
      return;
    }

    const users = await prisma.users.findMany();
    reply.send(patch(users));
  }
} as RouteOptions);

/** GET A USER BY USER_IDENTIFIER */
app.route({
  method: 'GET',
  url: '/users/:user_identifier/:secret_key',
  handler: async (request: any, reply) => {
    console.log(request.params.user_identifier);
    console.log(request.params.secret_key);

    if (request.params.secret_key !== process.env.SECRET_TOKEN) {
      reply.code(401).send({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.users.findMany({ where: { user_identifier: String(request.params.user_identifier) } });

    if (user == null) {
      reply.code(404).send({ message: 'User not found' });
      return;
    }

    reply.send(patch(user[0]));
  }
} as RouteOptions);

/** CREATE A NEW USER */
app.route({
  method: 'POST',
  url: '/users/create/:secret_key',
  handler: async (request: any, reply) => {
    if (request.params.secret_key !== process.env.SECRET_TOKEN) {
      reply.code(401).send({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.users.create({ data: request.body });
    reply.send(patch(user));
  }
} as RouteOptions);