import { NextRequest, NextResponse } from "next/server";
import { ALL_TOOLS, TOOL_NAMES, callTool } from "@/lib/canva-tools";
import { canvaError } from "@/lib/canva";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROTOCOL_VERSION = "2024-11-05";
const SERVER_INFO = { name: "canva-mcp-vercel", version: "0.1.0" };

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
};

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: any;
};

function ok(id: any, result: any, sessionId?: string | null) {
  const headers: Record<string, string> = { ...CORS_HEADERS };
  if (sessionId) headers["mcp-session-id"] = sessionId;
  return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers });
}

function err(id: any, code: number, message: string, status = 200) {
  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    { status, headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return new NextResponse(null, {
    status: 405,
    headers: { ...CORS_HEADERS, Allow: "POST, OPTIONS" },
  });
}

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("mcp-session-id");

  let body: JsonRpcRequest;
  try {
    body = await req.json();
  } catch {
    return err(null, -32700, "Parse error: invalid JSON", 400);
  }

  const { method, id, params } = body || ({} as JsonRpcRequest);
  const isNotification = id === undefined || id === null;

  try {
    if (method === "initialize") {
      return ok(
        id,
        {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER_INFO,
        },
        sessionId
      );
    }

    if (
      method === "notifications/initialized" ||
      method === "notifications/cancelled"
    ) {
      return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
    }

    if (method === "ping") return ok(id, {}, sessionId);

    if (method === "tools/list") {
      return ok(id, { tools: ALL_TOOLS }, sessionId);
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params ?? {};
      if (!name || !TOOL_NAMES.has(name)) {
        return ok(
          id,
          {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true,
          },
          sessionId
        );
      }
      try {
        const result = await callTool(name, args ?? {});
        return ok(
          id,
          {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false,
          },
          sessionId
        );
      } catch (e) {
        const { message } = canvaError(e);
        return ok(
          id,
          { content: [{ type: "text", text: message }], isError: true },
          sessionId
        );
      }
    }

    if (isNotification) {
      return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
    }
    return err(id, -32601, `Method not found: ${method}`);
  } catch (e) {
    const { code, message } = canvaError(e);
    return err(id, code, message);
  }
}
