import fastify from "fastify";
export const app = fastify();

async function server() {
  import("./routes/users.routes");

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