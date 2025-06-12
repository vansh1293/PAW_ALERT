import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

function webStreamToNodeReadable(
  webStream: ReadableStream<Uint8Array>
): Readable {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.push(Buffer.from(value));
      }
      this.push(null);
    },
  });
}

export async function POST(req: NextRequest) {
  // Ensure uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      return Date.now() + "-" + part.originalFilename;
    },
  });

  // Convert Web ReadableStream to Node.js Readable
  const nodeReq = webStreamToNodeReadable(
    req.body as ReadableStream<Uint8Array>
  );

  return new Promise((resolve, reject) => {
    // formidable expects a Node.js IncomingMessage, but we only have a Readable stream.
    // We'll fake the minimum properties needed for formidable to work.
    (nodeReq as any).headers = Object.fromEntries(req.headers.entries());
    (nodeReq as any).method = req.method;
    (nodeReq as any).url = req.url;
    (nodeReq as any).socket = {};
    form.parse(nodeReq as any, async (err, fields, files) => {
      if (err) {
        resolve(
          NextResponse.json(
            { success: false, error: "Error parsing form data" },
            { status: 400 }
          )
        );
        return;
      }
      // Handle array or single value for fields/files
      const image = Array.isArray(files.image) ? files.image[0] : files.image;
      const location = Array.isArray(fields.location)
        ? fields.location[0]
        : fields.location;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description;
      if (!image) {
        resolve(
          NextResponse.json(
            { success: false, error: "Image is required" },
            { status: 400 }
          )
        );
        return;
      }
      resolve(
        NextResponse.json({
          success: true,
          message: "Form received!",
          location,
          description,
          filePath: `/uploads/${path.basename(image.filepath)}`,
        })
      );
    });
  });
}
