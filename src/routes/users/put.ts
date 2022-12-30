import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";

app.put("/users/:userIdentifier/update", {
  handler: async(request: FastifyRequest<{ Params: Types["Params"], Body: Types["Body"] }>, reply: FastifyReply) => {
    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    reply.send(patch(await prisma.users.update({
      where: { id: user[0].id },
      data: request.body
    })));
  }
});