import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function patch(data: any) {
  return JSON.parse(JSON.stringify(data, (_, value) => typeof value === "bigint" ? value.toString() : value));
}

export default prisma;