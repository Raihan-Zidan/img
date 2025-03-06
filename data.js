import jpeg from './jpeg-js-bundled.js';

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const imageUrl = url.searchParams.get('url');

      if (!imageUrl) {
        return new Response('Missing ?url parameter', { status: 400 });
      }

      // Fetch image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return new Response('Failed to fetch image', { status: 400 });
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Decode JPEG
      const rawImageData = jpeg.decode(uint8Array, { useTArray: true });

      return new Response(JSON.stringify({
        width: rawImageData.width,
        height: rawImageData.height,
        dataLength: rawImageData.data.length
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
