import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";

app.post("/tasks/create/:userIdentifier", {
  handler: async(request: FastifyRequest<{ Params: Types["Params"], Body: Types["Body"] }>, reply: FastifyReply) => {
    reply.send(patch(await prisma.tasks.create({ data: request.body })));
  }
});