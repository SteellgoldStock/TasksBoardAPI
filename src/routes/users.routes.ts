import { FastifyReply, FastifyRequest } from "fastify";
import { RouteOptions } from "fastify/types/route";
import { app } from "..";
import prisma, { patch } from "../utils/prisma";
import { checkEnvKey } from "../utils/Validator";

type Params = {
  userIdentifier: string;
  secretKey: string;
}

type Body = {
  userIdentifier: string;
  userSecret: string;
  userName: string;
}

/** GET ALL USERS */
app.route({ method: "GET", url: "/users/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    const users = await prisma.users.findMany();
    reply.send(patch(users));
  }
} as RouteOptions);

/** GET A USER BY USER_IDENTIFIER */
app.route({ method: "GET", url: "/users/:userIdentifier/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });
    reply.send(patch(user[0]));
  }
} as RouteOptions);

/** GET TASKS OF A USER */
app.route({ method: "GET", url: "/users/:userIdentifier/tasks/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    const tasks = await prisma.tasks.findMany({ where: { taskAuthor: String(request.params.userIdentifier) } });
    reply.send(patch(tasks));
  }
} as RouteOptions);

/** GET THE COUNT OF TASKS OF A USER */
app.route({ method: "GET", url: "/users/:userIdentifier/tasks/count/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    const tasks = await prisma.tasks.findMany({ where: { taskAuthor: String(request.params.userIdentifier) } });
    reply.send(patch(tasks.length));
  }
} as RouteOptions);

/** CREATE A NEW USER */
app.route({ method: "POST", url: "/users/create/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params, Body: Body }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    reply.send(patch(await prisma.users.create({ data: request.body })));
  }
} as RouteOptions);

/** UPDATE A USER */
app.route({ method: "PUT", url: "/users/:userIdentifier/update/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params, Body: Body }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    reply.send(patch(await prisma.users.update({
      where: { id: user[0].id },
      data: request.body
    })));
  }
} as RouteOptions);

/** DELETE A USER */
app.route({ method: "DELETE", url: "/users/:userIdentifier/delete/:secretKey",
  handler: async(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    checkEnvKey(request.params.secretKey, reply);

    const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
    if (!user[0]) return reply.code(404).send({ message: "User not found" });

    reply.send(patch(await prisma.users.delete({ where: { id: user[0].id } })));
  }
} as RouteOptions);