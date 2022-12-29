import fastify from "fastify";
export const app = fastify();

async function server() {
  import("./routes/users/get");
  import("./routes/users/(tasks)/get");
  import("./routes/users/(tasks)/(count)/get");
  import("./routes/users/(create)/post");
  import("./routes/users/(update)/put");
  import("./routes/users/(delete)/delete");

  // TODO: Check if in super-routes token given is valid (corresponds to secretKey in .env)
  // app.addHook("preHandler", async(request, reply) => {
  //   if (request.url.startsWith("/tasks/")) {
  //     console.log("preHandler");
  //   }
  // });

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