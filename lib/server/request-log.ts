/**
 * One JSON line per API request, for Vercel's log drain or any JSON log search.
 * Fields are chosen by server code only: never briefs, drafts, emails, tokens, IPs or provider bodies.
 */
export type LogValue = string | number | boolean | null;
export type LogFields = Record<string, LogValue>;
export type LogSink = (line: string) => void;

export interface RequestLog {
  readonly requestId: string;
  /** Adds fields to this request's log line, e.g. an error code or token usage. */
  set(fields: LogFields): void;
}

export const writeLogLine: LogSink = (line) => console.log(line);

const levelFor = (status: number) => status >= 500 ? "error" : status >= 400 ? "warn" : "info";

export const withRequestLog = <Args extends unknown[]>(
  route: string,
  handler: (request: Request, log: RequestLog, ...args: Args) => Promise<Response>,
  sink: LogSink = writeLogLine,
) => async (request: Request, ...args: Args): Promise<Response> => {
  const requestId = crypto.randomUUID();
  const started = performance.now();
  const fields: LogFields = {};
  const log: RequestLog = { requestId, set: (more) => { Object.assign(fields, more); } };
  let status = 500;
  try {
    const response = await handler(request, log, ...args);
    status = response.status;
    try { response.headers.set("X-Request-Id", requestId); } catch { /* immutable headers, e.g. redirects */ }
    return response;
  } finally {
    // Fixed keys go last so handler fields can't overwrite them.
    sink(JSON.stringify({
      ...fields,
      time: new Date().toISOString(),
      level: levelFor(status),
      event: "http_request",
      requestId,
      route,
      method: request.method,
      status,
      durationMs: Math.round(performance.now() - started),
    }));
  }
};
