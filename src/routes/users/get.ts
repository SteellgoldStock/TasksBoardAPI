import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";

app.get("/users", {
  handler: async(request: FastifyRequest<{ Params: Types["UserParams"] }>, reply: FastifyReply) => {
    const users = await prisma.users.findMany();
    reply.send(patch(users));
  }
});

app.get("/users/:userIdentifier", {
  handler: async(request: FastifyRequest<{ Params: Types["UserParams"] }>, reply: FastifyReply) => {
    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });
    reply.send(patch(user[0]));
  }
});