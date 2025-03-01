export default {
  async fetch(request, env) {
    // Ambil file WASM dari Cloudflare Worker
    const wasmModule = await WebAssembly.instantiate(env.libjpeg);

    return new Response("WASM loaded successfully!", { status: 200 });
  },
};
