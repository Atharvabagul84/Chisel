import { createAuthHandler } from "@/lib/server/auth-controller";
import { createAuthGateway } from "@/lib/server/auth-supabase";
import { withRequestLog } from "@/lib/server/request-log";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const POST = withRequestLog("auth.send-code", (request: Request) => createAuthHandler("send-code", getSupabaseConfig() ? createAuthGateway : null)(request));
