import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Types } from "./types/Types";
import prisma from "./utils/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";
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
    if (!secretToken) return reply.code(401).send({ message: "Unauthorized: Secret missing" });

    if (request.url.startsWith("/users")) {
      // For UPDATE, DELETE and GET need JWT
      // For POST need SECRET_TOKEN
      if (secretToken !== process.env.SECRET_TOKEN) return reply.code(401).send({ message: "Unauthorized" });
    } else if (request.url.startsWith("/tasks")) {
      try {
        const decoded = jwt.decode(secretToken);

        const decodedSchema = z.object({
          user: z.string().min(36).max(36),
          secret: z.string().min(25).max(25)
        }).safeParse(decoded);

        if (!decodedSchema.success) return reply.code(400).send({ message: "Bad Request: Invalid authorization bearer token" });
        const user = await prisma.users.findMany({ where: {
          userIdentifier: String(decodedSchema.data.user),
          userSecret: String(decodedSchema.data.secret)
        } });

        if (!user[0]) return reply.code(404).send({ message: "User not found" });
      } catch (err) {
        return reply.code(400).send({ message: "Bad Request: Invalid authorization bearer token" });
      }
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