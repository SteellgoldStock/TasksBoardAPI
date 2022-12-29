import { RouteOptions } from "fastify/types/route";
import { app } from "..";
import prisma, { patch } from "../utils/prisma";

/** GET ALL USERS */
app.route({
  method: "GET",
  url: "/users/:secretKey",
  handler: async(request: any, reply: any) => {
    if (request.params.secretKey !== process.env.SECRET_TOKEN) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    const users = await prisma.users.findMany();
    reply.send(patch(users));
  }
} as RouteOptions);

/** GET A USER BY USER_IDENTIFIER */
app.route({
  method: "GET",
  url: "/users/:userIdentifier/:secretKey",
  handler: async(request: any, reply: any) => {

    if (request.params.secretKey !== process.env.SECRET_TOKEN) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.users.findMany({
      where: {
        userIdentifier: String(request.params.userIdentifier)
      }
    });

    if (user == null) {
      reply.code(404).send({ message: "User not found" });
      return;
    }

    reply.send(patch(user[0]));
  }
} as RouteOptions);

/** CREATE A NEW USER */
app.route({
  method: "POST",
  url: "/users/create/:secretKey",
  handler: async(request: any, reply: any) => {
    if (request.params.secretKey !== process.env.SECRET_TOKEN) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.users.create({ data: request.body });
    reply.send(patch(user));
  }
} as RouteOptions);