import wasmModule from "./djpeg-static.wasm";

export default {
  async fetch(request, env, ctx) {
    return new Response("WASM Loaded Successfully!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
