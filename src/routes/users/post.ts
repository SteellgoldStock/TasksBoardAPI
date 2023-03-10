import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";
import z from "zod";

// TODO: Email, Password (For Auth: todo)
app.post("/users/create", {
  handler: async(request: FastifyRequest<{ Params: Types["UserParams"], Body: Types["UserBody"] }>, reply: FastifyReply) => {
    const bodySchema = z.object({
      userIdentifier: z.string().min(36).max(36),
      userSecret: z.string().min(25).max(25),
      userName: z.string().min(5).max(25)
    }).safeParse(request.body);

    const userIdentifier = await prisma.users.findMany({ where: { userIdentifier: request.body.userIdentifier } });
    if (userIdentifier[0]) return reply.code(400).send({ message: "User Identifier already use" });

    if (!bodySchema.success) return reply.code(400).send({ message: "Invalid Body" });
    reply.send(patch(await prisma.users.create({ data: request.body })));
  }
});