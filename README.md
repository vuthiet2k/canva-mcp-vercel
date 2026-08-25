# Canva MCP Server (Vercel Serverless)

A production-ready **Model Context Protocol (MCP)** Server for **Canva Connect REST API**, optimized for 1-Click Deployment on **Vercel** and direct integration with **Spark Gemini**, **Claude Desktop**, and **Cursor IDE**.

---

## 🌟 Highlights

- **Serverless & Ultra-Fast**: Built on Next.js App Router Node.js runtime with 60s execution limit for handling async export jobs.
- **20+ Canva Tools**: Covers design creation, brand template autofill, asset uploads, folder management, and format export (PDF, PNG, JPG, PPTX, MP4).
- **Stateless Authentication**: Uses `CANVA_ACCESS_TOKEN` via Bearer auth headers without any external database dependencies.
- **MCP Spec Compliant**: Fully supports protocol version `2024-11-05` JSON-RPC over HTTP with open CORS for remote clients.

---

## 🚀 1-Click Deploy to Vercel

1. Push this repository to your GitHub account (`vuthiet2k/canva-mcp-vercel`).
2. Go to [Vercel Dashboard](https://vercel.com/new) and Import `canva-mcp-vercel`.
3. Add Environment Variables:
   - `CANVA_ACCESS_TOKEN`: Your Canva Connect API Personal Access Token or OAuth Token from [Canva Developers](https://www.canva.dev/).
   - `CANVA_API_URL`: `https://api.canva.com/rest/v1` (default).
4. Click **Deploy**.

---

## ⚙️ Connecting to Spark Gemini

In your Spark Gemini MCP Configuration, add the server entry:

```json
{
  "mcpServers": {
    "canva": {
      "url": "https://canva-mcp-vercel.vercel.app/api/mcp",
      "transport": "http",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

---

## 🛠️ List of Provided Tools (24 Tools)

| Tool Name | Description |
| :--- | :--- |
| `canva_create_design` | Create a design by preset or custom dimensions |
| `canva_get_design` | Get design metadata and URLs |
| `canva_search_designs` | Search and list user designs |
| `canva_get_design_pages` | Get slide pages and thumbnails |
| `canva_resize_design` | Resize a design |
| `canva_search_brand_templates` | Find autofill-capable brand templates |
| `canva_get_brand_template` | Get brand template details |
| `canva_get_brand_template_dataset` | Retrieve dataset schema |
| `canva_autofill_design` | Generate new design by autofilling data into template |
| `canva_upload_asset_from_url` | Upload an image/video asset from public URL |
| `canva_get_asset` | Fetch asset metadata |
| `canva_delete_asset` | Remove asset from Canva library |
| `canva_list_brand_kits` | List Brand Kits (colors, fonts, logos) |
| `canva_create_folder` | Create a folder |
| `canva_list_folder_items` | List items inside a folder |
| `canva_search_folders` | Search folders by keyword |
| `canva_move_item_to_folder` | Move design or folder |
| `canva_get_export_formats` | Get available export formats |
| `canva_create_export_job` | Export design to PDF, PNG, JPG, PPTX, MP4 |
| `canva_get_export_job` | Check export status and get download link |
| `canva_get_user_profile` | Get current authenticated user profile |
| `canva_list_comments` | List design comments |
| `canva_comment_on_design` | Add comment on design |
| `canva_reply_to_comment` | Reply to design comment |

---

## 📄 License

MIT License © 2026 Hoàng Vũ Thiết
