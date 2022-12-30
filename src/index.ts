import fastify, { FastifyReply, FastifyRequest } from "fastify";
export const app = fastify();

async function server() {
  import("./routes/users/get");
  import("./routes/users/tasks/get");
  import("./routes/users/post");
  import("./routes/users/put");
  import("./routes/users/delete");

  app.addHook("preHandler", async(request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith("/users")) {
      if (request.headers.authorization?.split(" ")[1] !== process.env.SECRET_TOKEN) {
        reply.code(401).send({ message: "Unauthorized" });
        return;
      }
    }
  });

  try {
    await app.listen({ port: 3000 }).then(() => {
      console.log("Server listening on 127.0.0.1:3000");
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

server();