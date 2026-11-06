import { auth } from "@/lib/auth/auth-server";

// Passes every /api/auth/... request from the browser on to Neon Auth.
export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
