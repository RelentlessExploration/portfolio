import { v4 } from "uuid";
import { DEV_FRONTEND, FRONTEND_URL } from "..";
import { prefixMap } from "../constants/email";
import { redis } from "../redis";

export const createActionUrl = async (userId: number, action: string) => {
  const token = v4();

  const prefixedToken = (prefixMap[action] || "dG9rZW4=:") + token;

  await redis.set(prefixedToken, userId, "ex", 60 * 60 * 8); // expires in 8 hours
  return `${
    process.env.NODE_ENV === "production" ? FRONTEND_URL : DEV_FRONTEND
  }/auth/${action}/${prefixedToken}`;
};