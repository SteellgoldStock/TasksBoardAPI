import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "./../../../../";
import { Types } from "../../../../types/Types";
import prisma, { patch } from "../../../../utils/prisma";

app.get("/users/:userIdentifier/tasks/count/:secretKey", {
  handler: async(request: FastifyRequest<{ Params: Types["Params"] }>, reply: FastifyReply) => {
    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    const tasks = await prisma.tasks.findMany({ where: { taskAuthor: String(request.params.userIdentifier) } });
    reply.send(patch(tasks.length));
  }
});