import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Types } from "./types/Types";
import prisma from "./utils/prisma";
import jwt from "jsonwebtoken";
export const app = fastify();

async function server() {
  import("./routes/users/get");
  import("./routes/users/post");
  import("./routes/users/put");
  import("./routes/users/delete");

  import("./routes/tasks/get");
  import("./routes/tasks/post");
  import("./routes/tasks/put");

  app.addHook("preHandler", async(request: FastifyRequest<{ Params: Types["TaskParams"] }>, reply: FastifyReply) => {
    const secretToken = request.headers.authorization?.split(" ")[1];

    if (request.url.startsWith("/users")) {
      if (secretToken !== process.env.SECRET_TOKEN) return reply.code(401).send({ message: "Unauthorized" });
    } else if (request.url.startsWith("/tasks")) {
      const user = await prisma.users.findMany({ where: { userIdentifier: String(request.params.userIdentifier) } });
      if (!user[0]) return reply.code(404).send({ message: "User not found" });
      if (user[0].userSecret !== secretToken) return reply.code(401).send({ message: "Unauthorized" });
    }
  });

  try {
    await app.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
      console.log("Server listening on 0.0.0.0:3000");
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

server();