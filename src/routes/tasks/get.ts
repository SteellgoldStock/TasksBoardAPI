import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";

app.get("/tasks/:userIdentifier", {
  handler: async(request: FastifyRequest<{ Params: Types["TaskParams"] }>, reply: FastifyReply) => {
    const tasks = await prisma.tasks.findMany({
      where: {
        taskAuthor: String(request.params.userIdentifier)
      }
    });

    reply.send(patch(tasks));
  }
});