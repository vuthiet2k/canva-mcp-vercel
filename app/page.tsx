import { ALL_TOOLS } from "@/lib/canva-tools";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Canva MCP Server</h1>
          </div>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Model Context Protocol Server for Canva Connect REST API · Deployed on Vercel Serverless.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>MCP Server Online</span>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Protocol Version</span>
          <p className="text-xl font-bold text-white mt-1">2024-11-05</p>
          <p className="text-slate-400 text-xs mt-1">JSON-RPC 2.0 over HTTP/SSE</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Available Tools</span>
          <p className="text-xl font-bold text-white mt-1">{ALL_TOOLS.length} Active Tools</p>
          <p className="text-slate-400 text-xs mt-1">Designs, Autofills, Assets, Exports</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">MCP Endpoint</span>
          <p className="text-sm font-mono font-bold text-cyan-300 mt-1 truncate">/api/mcp</p>
          <p className="text-slate-400 text-xs mt-1">Serverless timeout: 60s</p>
        </div>
      </div>

      {/* Spark Gemini Config Box */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>⚡</span>
          <span>Cấu hình kết nối vào Spark Gemini & MCP Clients</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1 mb-4">
          Thêm cấu hình sau vào phần cài đặt MCP Server của Spark Gemini hoặc <code>claude_desktop_config.json</code>:
        </p>
        <pre className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
{`{
  "mcpServers": {
    "canva": {
      "url": "https://your-domain.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}`}
        </pre>
      </section>

      {/* Registered Tools List */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Danh Sách Công Cụ Canva ({ALL_TOOLS.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_TOOLS.map((tool) => (
            <div key={tool.name} className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-4 hover:border-slate-700 transition">
              <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/40 px-2 py-1 rounded">
                {tool.name}
              </span>
              <p className="text-slate-400 text-xs mt-2.5 leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
