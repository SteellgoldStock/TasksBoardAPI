import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { Types } from "../../types/Types";
import prisma, { patch } from "../../utils/prisma";
import z from "zod";

app.put("/tasks/:userIdentifier/update/:taskIdentifier", {
  handler: async(request: FastifyRequest<{ Params: Types["TaskParams"], Body: Types["TaskBody"] }>, reply: FastifyReply) => {
    const task = await prisma.tasks.findMany({ where: { taskIdentifier: String(request.params.taskIdentifier) } });
    if (!task[0]) return reply.code(404).send({ message: "Task not found" });

    const bodySchema = z.object({
      taskAuthor: z.string().optional(),
      taskTitle: z.string().optional(),
      taskContent: z.string().optional(),
      isCompleted: z.boolean().optional(),
      completedAt: z.string().optional(),
      createdAt: z.string().optional()
    }).safeParse(request.body);

    if (!bodySchema.success) return reply.code(400).send({ message: "Invalid Body" });

    reply.send(patch(await prisma.tasks.update({
      where: { id: task[0].id },
      data: request.body
    })));
  }
});