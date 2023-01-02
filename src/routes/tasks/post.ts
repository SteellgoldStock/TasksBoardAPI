import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";
import z from "zod";

app.post("/tasks/create", {
  handler: async(request: FastifyRequest<{ Params: Types["TaskParams"], Body: Types["TaskBody"] }>, reply: FastifyReply) => {
    const bodySchema = z.object({
      taskIdentifier: z.string().max(36).min(36),
      taskAuthor: z.string().min(36).max(36),
      taskTitle: z.string().min(5).max(25),
      taskContent: z.string().min(5).max(10000),
      isCompleted: z.boolean().default(false),
      completedAt: z.string().optional(),
      createdAt: z.string().optional()
    }).safeParse(request.body);

    if (!bodySchema.success) return reply.code(400).send({ message: "Invalid Body" });

    const taskIdentifier = await prisma.tasks.findMany({ where: { taskIdentifier: request.body.taskIdentifier } });
    if (taskIdentifier[0]) return reply.code(400).send({ message: "Task Identifier already use" });

    if (!request.body.createdAt) request.body.createdAt = new Date().toISOString();
    if (request.body.isCompleted) request.body.completedAt = new Date().toISOString();
    reply.send(patch(await prisma.tasks.create({ data: request.body })));
  }
});