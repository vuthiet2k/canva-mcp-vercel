import { canvaGet, canvaPost, canvaDelete } from "./canva";

export const ALL_TOOLS = [
  // 1. Profile
  {
    name: "canva_get_user_profile",
    description: "Get the profile information of the currently authenticated Canva user.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // 2. Designs
  {
    name: "canva_create_design",
    description: "Create a new Canva design by preset type (e.g. presentation, doc, flyer, poster, instagram_post) or custom dimensions.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title for the new design" },
        design_type: {
          type: "string",
          enum: ["doc", "presentation", "poster", "flyer", "instagram_post", "facebook_post", "youtube_thumbnail", "invitation", "resume"],
          description: "Preset design type",
        },
        width: { type: "number", description: "Custom width in pixels (required if design_type not specified)" },
        height: { type: "number", description: "Custom height in pixels (required if design_type not specified)" },
        asset_id: { type: "string", description: "Optional asset ID to initialize the design with" },
      },
    },
  },
  {
    name: "canva_get_design",
    description: "Get detailed metadata about a Canva design (URLs for edit/view, thumbnail, page count, timestamps).",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design (starts with 'D')" },
      },
      required: ["design_id"],
    },
  },
  {
    name: "canva_search_designs",
    description: "Search and list designs in the user's Canva account.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional search keyword" },
        sort_by: {
          type: "string",
          enum: ["relevance", "modified_descending", "modified_ascending", "title_ascending", "title_descending"],
          description: "Sort order",
        },
        continuation: { type: "string", description: "Pagination token from previous response" },
      },
    },
  },
  {
    name: "canva_get_design_pages",
    description: "Get the list of pages with thumbnails for a Canva design (e.g. presentation slides).",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design" },
        limit: { type: "number", description: "Maximum pages to return (default: 50)" },
        offset: { type: "number", description: "1-based page index to start" },
      },
      required: ["design_id"],
    },
  },
  {
    name: "canva_resize_design",
    description: "Resize an existing Canva design to a preset or custom width/height.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design to resize" },
        design_type: { type: "string", enum: ["presentation", "whiteboard"], description: "Preset name" },
        width: { type: "number", description: "Custom width in pixels" },
        height: { type: "number", description: "Custom height in pixels" },
      },
      required: ["design_id"],
    },
  },

  // 3. Brand Templates & Autofill
  {
    name: "canva_search_brand_templates",
    description: "Search and list Brand Templates available to the user for generative design creation.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword" },
        dataset: { type: "string", enum: ["any", "non_empty"], description: "Filter autofill-capable templates ('non_empty')" },
        continuation: { type: "string", description: "Pagination token" },
      },
    },
  },
  {
    name: "canva_get_brand_template",
    description: "Get metadata for a specific Brand Template by ID.",
    inputSchema: {
      type: "object",
      properties: {
        brand_template_id: { type: "string", description: "ID of the brand template" },
      },
      required: ["brand_template_id"],
    },
  },
  {
    name: "canva_get_brand_template_dataset",
    description: "Get the autofill dataset schema of a Brand Template to understand dynamic text/image fields.",
    inputSchema: {
      type: "object",
      properties: {
        brand_template_id: { type: "string", description: "ID of the brand template" },
      },
      required: ["brand_template_id"],
    },
  },
  {
    name: "canva_autofill_design",
    description: "Autofill dynamic content (text, image URLs, charts) into a Brand Template to produce a new design.",
    inputSchema: {
      type: "object",
      properties: {
        brand_template_id: { type: "string", description: "ID of the brand template" },
        title: { type: "string", description: "Title for the generated design" },
        data: {
          type: "object",
          description: "Key-value data payload matching template dataset schema, e.g. { headline: { type: 'text', text: 'Hello' }, hero_img: { type: 'image', asset_id: '...' } }",
        },
      },
      required: ["brand_template_id", "data"],
    },
  },

  // 4. Assets & Brand Kits
  {
    name: "canva_upload_asset_from_url",
    description: "Upload an image or video asset into Canva library from a public HTTPS URL.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public HTTPS URL of the image or video" },
        name: { type: "string", description: "File name for the asset" },
      },
      required: ["url", "name"],
    },
  },
  {
    name: "canva_get_asset",
    description: "Get asset metadata and thumbnail by asset ID.",
    inputSchema: {
      type: "object",
      properties: {
        asset_id: { type: "string", description: "ID of the asset" },
      },
      required: ["asset_id"],
    },
  },
  {
    name: "canva_delete_asset",
    description: "Delete an uploaded asset from Canva library.",
    inputSchema: {
      type: "object",
      properties: {
        asset_id: { type: "string", description: "ID of the asset to delete" },
      },
      required: ["asset_id"],
    },
  },
  {
    name: "canva_list_brand_kits",
    description: "List all Brand Kits (colors, fonts, logos) accessible to the user.",
    inputSchema: {
      type: "object",
      properties: {
        continuation: { type: "string", description: "Pagination token" },
      },
    },
  },

  // 5. Folders
  {
    name: "canva_create_folder",
    description: "Create a new folder in Canva.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the folder" },
        parent_folder_id: { type: "string", description: "Parent folder ID or 'root'" },
      },
      required: ["name", "parent_folder_id"],
    },
  },
  {
    name: "canva_list_folder_items",
    description: "List items (designs, folders, images) in a specified Canva folder.",
    inputSchema: {
      type: "object",
      properties: {
        folder_id: { type: "string", description: "Folder ID or 'root'" },
        item_types: {
          type: "array",
          items: { type: "string", enum: ["design", "folder", "image"] },
          description: "Filter by item types",
        },
        continuation: { type: "string", description: "Pagination token" },
      },
      required: ["folder_id"],
    },
  },
  {
    name: "canva_search_folders",
    description: "Search user folders by keyword and tags.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Folder search query" },
        continuation: { type: "string", description: "Pagination token" },
      },
    },
  },
  {
    name: "canva_move_item_to_folder",
    description: "Move a design, folder, or asset to another folder.",
    inputSchema: {
      type: "object",
      properties: {
        item_id: { type: "string", description: "ID of the item to move" },
        to_folder_id: { type: "string", description: "Destination folder ID or 'root'" },
      },
      required: ["item_id", "to_folder_id"],
    },
  },

  // 6. Export & Download
  {
    name: "canva_get_export_formats",
    description: "Get supported export formats (PDF, PNG, JPG, PPTX, MP4, GIF) for a specific design.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design" },
      },
      required: ["design_id"],
    },
  },
  {
    name: "canva_create_export_job",
    description: "Start an export job for a design (PDF, PNG, JPG, PPTX, MP4, GIF).",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design to export" },
        format_type: { type: "string", enum: ["pdf", "png", "jpg", "pptx", "mp4", "gif"], description: "Export format" },
        export_quality: { type: "string", enum: ["regular", "pro"], description: "Export quality" },
        pages: { type: "array", items: { type: "number" }, description: "1-based page numbers to export" },
        transparent_background: { type: "boolean", description: "Transparent background for PNG" },
      },
      required: ["design_id", "format_type"],
    },
  },
  {
    name: "canva_get_export_job",
    description: "Check status of an export job and get the download URL when completed.",
    inputSchema: {
      type: "object",
      properties: {
        export_id: { type: "string", description: "Export Job ID" },
      },
      required: ["export_id"],
    },
  },

  // 7. Collaboration
  {
    name: "canva_list_comments",
    description: "List comments and discussion threads on a Canva design.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design" },
        limit: { type: "number", description: "Max comments to return" },
        continuation: { type: "string", description: "Pagination token" },
      },
      required: ["design_id"],
    },
  },
  {
    name: "canva_comment_on_design",
    description: "Post a comment on a Canva design.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design" },
        message_plaintext: { type: "string", description: "Comment text message" },
      },
      required: ["design_id", "message_plaintext"],
    },
  },
  {
    name: "canva_reply_to_comment",
    description: "Reply to an existing comment thread on a Canva design.",
    inputSchema: {
      type: "object",
      properties: {
        design_id: { type: "string", description: "ID of the design" },
        comment_id: { type: "string", description: "ID of the comment to reply to" },
        message_plaintext: { type: "string", description: "Reply text message" },
      },
      required: ["design_id", "comment_id", "message_plaintext"],
    },
  },
];

export const TOOL_NAMES = new Set(ALL_TOOLS.map((t) => t.name));

export async function callTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    case "canva_get_user_profile":
      return await canvaGet("/users/me");

    case "canva_create_design": {
      const payload: any = { title: args.title || "Untitled Design" };
      if (args.design_type) {
        payload.design_type = { type: "preset", name: args.design_type };
      } else if (args.width && args.height) {
        payload.design_type = { type: "custom", width: args.width, height: args.height };
      } else {
        payload.design_type = { type: "preset", name: "presentation" };
      }
      if (args.asset_id) payload.asset_id = args.asset_id;
      return await canvaPost("/designs", payload);
    }

    case "canva_get_design":
      return await canvaGet(`/designs/${args.design_id}`);

    case "canva_search_designs":
      return await canvaGet("/designs", {
        query: args.query,
        sort_by: args.sort_by,
        continuation: args.continuation,
      });

    case "canva_get_design_pages":
      return await canvaGet(`/designs/${args.design_id}/pages`, {
        limit: args.limit,
        offset: args.offset,
      });

    case "canva_resize_design": {
      const resizePayload: any = {};
      if (args.design_type) {
        resizePayload.design_type = { type: "preset", name: args.design_type };
      } else if (args.width && args.height) {
        resizePayload.design_type = { type: "custom", width: args.width, height: args.height };
      }
      return await canvaPost(`/designs/${args.design_id}/resize`, resizePayload);
    }

    case "canva_search_brand_templates":
      return await canvaGet("/brand-templates", {
        query: args.query,
        dataset: args.dataset,
        continuation: args.continuation,
      });

    case "canva_get_brand_template":
      return await canvaGet(`/brand-templates/${args.brand_template_id}`);

    case "canva_get_brand_template_dataset":
      return await canvaGet(`/brand-templates/${args.brand_template_id}/dataset`);

    case "canva_autofill_design":
      return await canvaPost("/autofills", {
        brand_template_id: args.brand_template_id,
        title: args.title,
        data: args.data,
      });

    case "canva_upload_asset_from_url":
      return await canvaPost("/asset-uploads", {
        url: args.url,
        name: args.name,
      });

    case "canva_get_asset":
      return await canvaGet(`/assets/${args.asset_id}`);

    case "canva_delete_asset":
      return await canvaDelete(`/assets/${args.asset_id}`);

    case "canva_list_brand_kits":
      return await canvaGet("/brand-kits", { continuation: args.continuation });

    case "canva_create_folder":
      return await canvaPost("/folders", {
        name: args.name,
        parent_folder_id: args.parent_folder_id,
      });

    case "canva_list_folder_items":
      return await canvaGet(`/folders/${args.folder_id}/items`, {
        item_types: args.item_types ? args.item_types.join(",") : undefined,
        continuation: args.continuation,
      });

    case "canva_search_folders":
      return await canvaGet("/folders", {
        query: args.query,
        continuation: args.continuation,
      });

    case "canva_move_item_to_folder":
      return await canvaPost("/folders/move", {
        item_id: args.item_id,
        to_folder_id: args.to_folder_id,
      });

    case "canva_get_export_formats":
      return await canvaGet(`/designs/${args.design_id}/export-formats`);

    case "canva_create_export_job": {
      const formatObj: any = { type: args.format_type };
      if (args.export_quality) formatObj.export_quality = args.export_quality;
      if (args.pages) formatObj.pages = args.pages;
      if (args.transparent_background !== undefined) formatObj.transparent_background = args.transparent_background;
      return await canvaPost("/exports", {
        design_id: args.design_id,
        format: formatObj,
      });
    }

    case "canva_get_export_job":
      return await canvaGet(`/exports/${args.export_id}`);

    case "canva_list_comments":
      return await canvaGet("/comments", {
        design_id: args.design_id,
        limit: args.limit,
        continuation: args.continuation,
      });

    case "canva_comment_on_design":
      return await canvaPost("/comments", {
        design_id: args.design_id,
        message_plaintext: args.message_plaintext,
      });

    case "canva_reply_to_comment":
      return await canvaPost(`/comments/${args.comment_id}/replies`, {
        design_id: args.design_id,
        message_plaintext: args.message_plaintext,
      });

    default:
      throw new Error(`Tool handler not implemented for '${name}'`);
  }
}
