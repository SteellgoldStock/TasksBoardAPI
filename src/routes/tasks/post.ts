import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";
import z from "zod";

app.post("/tasks/create/:userIdentifier", {
  handler: async(request: FastifyRequest<{ Params: Types["Params"], Body: Types["Body"] }>, reply: FastifyReply) => {
    const bodySchema = z.object({
      taskIdentifier: z.string().min(32).max(32),
      taskAuthor: z.string().min(32).max(32),
      taskTitle: z.string().min(5).max(25),
      taskContent: z.string().min(5).max(10000),
      isCompleted: z.boolean().default(false)
    });

    const bodyParsed = bodySchema.safeParse(request.body);
    if (!bodyParsed.success) return reply.code(400).send({ message: "Invalid Body" });

    reply.send(patch(await prisma.tasks.create({ data: request.body })));
  }
});