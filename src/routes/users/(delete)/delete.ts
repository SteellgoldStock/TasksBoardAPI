import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../../..";
import { Types } from "../../../types/Types";
import prisma, { patch } from "../../../utils/prisma";

app.delete("/users/:userIdentifier/delete", {
  handler: async(request: FastifyRequest<{ Params: Types["Params"] }>, reply: FastifyReply) => {
    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    reply.send(patch(await prisma.users.delete({ where: { id: user[0].id } })));
  }
});