const jpeg = require("./jpeg-js-bundled.js");

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Ambil URL gambar dari parameter
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response("Missing ?url parameter", { status: 400 });
    }

    // Fetch gambar
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 500 });
    }

    // Convert ke ArrayBuffer
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Decode JPEG pakai jpeg-js
    const decoded = jpeg.decode(uint8Array, { useTArray: true });

    // Encode kembali dengan quality 50
    const encoded = jpeg.encode(decoded, 50); // 50 = kualitas

    // Return hasil compress
    return new Response(encoded.data, {
      headers: { "Content-Type": "image/jpeg" },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
