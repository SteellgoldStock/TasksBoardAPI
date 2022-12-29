import { FastifyReply } from "fastify";

export function checkEnvKey(key: string, reply: FastifyReply): void {
  if (key !== process.env.SECRET_TOKEN) {
    reply.code(401).send({ message: "Unauthorized" });
    return;
  }
}