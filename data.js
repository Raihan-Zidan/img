import jpegJs from 'https://esm.sh/jpeg-js';

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const imageUrl = url.searchParams.get('url');

      if (!imageUrl) {
        return new Response('Missing ?url parameter', { status: 400 });
      }

      // Fetch the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return new Response('Failed to fetch image', { status: 400 });
      }

      // Convert response to Uint8Array
      const arrayBuffer = await imageResponse.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Decode JPEG (tanpa useTArray karena tidak kompatibel)
      const rawImageData = jpegJs.decode(uint8Array, { useTArray: false });

      return new Response(JSON.stringify({
        width: rawImageData.width,
        height: rawImageData.height,
        dataLength: rawImageData.data.length
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
