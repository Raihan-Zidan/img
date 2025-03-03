import wasmModule from "./djpeg-static.wasm";

export default {
  async fetch(req) {
    try {
      // Dummy imports biar gak error
      const imports = {
        a: {}, // Pastikan 'a' ada sebagai objek
        env: {}, // Tambahkan 'env' kalau perlu
      };

      // Instantiate WASM dengan imports
      const wasmObj = await WebAssembly.instantiate(wasmModule, imports);
      const wasmInstance = wasmObj.instance;

      if (!wasmInstance) {
        throw new Error("wasmInstance tidak terdefinisi");
      }

      // Ambil daftar exports
      const exports = Object.keys(wasmInstance.exports);

      return new Response(
        JSON.stringify({ exports }, null, 2),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(`Error saat memeriksa WASM: ${err.message}`, { status: 500 });
    }
  },
};
