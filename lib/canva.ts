import axios, { AxiosError, AxiosRequestConfig } from "axios";

const CANVA_API = process.env.CANVA_API_URL || "https://api.canva.com/rest/v1";
const TOKEN = process.env.CANVA_ACCESS_TOKEN;
const UA = "canva-mcp-vercel/0.1.0";

function assertToken() {
  if (!TOKEN) throw new Error("CANVA_ACCESS_TOKEN is not configured in environment variables");
}

function headers(): Record<string, string> {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": UA,
  };
}

export async function canvaGet<T = any>(path: string, params?: Record<string, any>): Promise<T> {
  assertToken();
  const res = await axios.get<T>(`${CANVA_API}${path}`, {
    headers: headers(),
    params,
    timeout: 45_000,
  });
  return res.data;
}

export async function canvaPost<T = any>(path: string, body?: any, opts?: AxiosRequestConfig): Promise<T> {
  assertToken();
  const res = await axios.post<T>(`${CANVA_API}${path}`, body, {
    headers: headers(),
    timeout: 45_000,
    ...opts,
  });
  return res.data;
}

export async function canvaDelete<T = any>(path: string): Promise<T> {
  assertToken();
  const res = await axios.delete<T>(`${CANVA_API}${path}`, {
    headers: headers(),
    timeout: 45_000,
  });
  return res.data;
}

export type CanvaErr = { code: number; message: string };

function rateInfo(h: Record<string, any> | undefined): string {
  if (!h) return "";
  const rem = h["x-ratelimit-remaining"];
  const reset = h["x-ratelimit-reset"];
  const retryAfter = h["retry-after"];
  const bits: string[] = [];
  if (rem !== undefined) bits.push(`remaining=${rem}`);
  if (reset !== undefined) bits.push(`reset=${reset}s`);
  if (retryAfter !== undefined) bits.push(`retry_after=${retryAfter}s`);
  return bits.length ? ` [Rate Limit: ${bits.join(" ")}]` : "";
}

export function canvaError(e: unknown): CanvaErr {
  const ax = e as AxiosError<any>;
  if (ax?.isAxiosError) {
    const status = ax.response?.status;
    const data = ax.response?.data;
    const detail =
      (data && (data.message || data.error || data.error_description || JSON.stringify(data))) ||
      ax.message ||
      "Unknown Canva API error";
    const rate = rateInfo(ax.response?.headers as Record<string, any> | undefined);

    if (status === 401) {
      return { code: -32001, message: `Canva 401 (Unauthorized): Invalid or expired CANVA_ACCESS_TOKEN. ${detail}${rate}` };
    }
    if (status === 403) {
      return { code: -32002, message: `Canva 403 (Forbidden): Insufficient scopes or permissions for this resource. ${detail}${rate}` };
    }
    if (status === 404) {
      return { code: -32003, message: `Canva 404 (Not Found): The requested design, asset, or template does not exist. ${detail}${rate}` };
    }
    if (status === 429) {
      return { code: -32006, message: `Canva 429 (Rate Limited): Too many requests. ${detail}${rate}` };
    }
    return {
      code: -32000,
      message: `Canva API Error (${status || "Unknown"}): ${detail}${rate}`,
    };
  }
  return { code: -32000, message: (e as Error)?.message || String(e) };
}
