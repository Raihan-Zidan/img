import wasmModule from "./djpeg-static.wasm";

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response("Parameter ?url= harus diisi", { status: 400 });
    }

    try {
      // Ambil gambar dari URL
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error("Gagal mengambil gambar");

      const imgBuffer = await imgRes.arrayBuffer();

      // Dummy imports, masih pakai banyak fungsi
      const imports = {
        env: {
          memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
          abort: () => {
            throw new Error("WASM aborted (dari env.abort)");
          },
        },
        a: {
          a: () => 42,
          b: () => 42,
        },
      };

      // Coba instantiate WASM
      let wasmInstance;
      try {
        const wasmObj = await WebAssembly.instantiate(wasmModule, imports);
        wasmInstance = wasmObj.instance;
      } catch (wasmErr) {
        throw new Error(`Gagal instantiate WASM: ${wasmErr.message}`);
      }

      if (!wasmInstance) {
        throw new Error("wasmInstance tidak terdefinisi");
      }

      if (!wasmInstance.exports || !wasmInstance.exports.resize) {
        throw new Error("Fungsi 'resize' tidak ditemukan dalam WASM");
      }

      // Buat buffer untuk output
      const input = new Uint8Array(imgBuffer);
      const output = new Uint8Array(input.length);

      wasmInstance.exports.resize(input, output, 200, 200);

      return new Response(output, {
        headers: { "Content-Type": "image/jpeg" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
