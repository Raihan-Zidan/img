import { decode } from "https://esm.sh/@jsquash/jpeg";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return new Response("Missing ?url parameter", { status: 400 });
    }

    // Fetch image from URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return new Response("Failed to fetch image", { status: 400 });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Decode JPEG using @jsquash/jpeg
    const decodedImage = await decode(uint8Array);

    return new Response(
      JSON.stringify({
        width: decodedImage.width,
        height: decodedImage.height,
        dataLength: decodedImage.data.byteLength,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
