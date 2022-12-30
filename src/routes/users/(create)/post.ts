import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../../..";
import { Types } from "../../../types/Types";
import prisma, { patch } from "../../../utils/prisma";

app.post("/users/create", {
  handler: async(request: FastifyRequest<{ Params: Types["Params"], Body: Types["Body"] }>, reply: FastifyReply) => {
    reply.send(patch(await prisma.users.create({ data: request.body })));
  }
});