"use client";

import { createAuthClient } from "@neon/auth/next";

// The browser's side of Neon Auth. It sends every request to our own /api/auth route.
export const authClient = createAuthClient();
