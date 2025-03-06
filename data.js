import wasmModuleUrl from './djpeg-static.wasm';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    if (!imageUrl) {
      return new Response('Missing ?url parameter', { status: 400 });
    }

    // Load WASM module
    const wasmModule = await WebAssembly.instantiateStreaming(fetch(wasmModuleUrl));
    const { instance } = wasmModule;

    // Load JavaScript wrapper
    const jsModule = await import('./djpeg-static.js');
    const djpeg = await jsModule.default({ wasmBinary: instance });

    // Fetch the image from URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return new Response('Failed to fetch image', { status: 400 });
    }
    const arrayBuffer = await imageResponse.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Compress the image using the WASM module
    const compressedImage = djpeg.compress(uint8Array, { quality: 75 });

    return new Response(compressedImage, {
      headers: {
        'Content-Type': 'image/jpeg',
      }
    });
  }
};
