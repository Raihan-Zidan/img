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

      // Dummy imports, tambahin banyak fungsi biar gak error terus
      const imports = {
        env: {
          memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
          abort: () => {
            throw new Error("WASM aborted (dari env.abort)");
          },
          print_log: (msg) => {
            throw new Error(`WASM log: ${msg}`);
          },
        },
        a: {
          a: () => 42,
          b: () => 42,
          c: () => 42,
          d: () => 42,
          e: () => 42,
          f: () => 42,
          g: () => 42,
          h: () => 42,
          i: () => 42,
          j: () => 42,
          k: () => 42,
          l: () => 42,
          m: () => 42,
          n: () => 42,
          o: () => 42,
          p: () => 42,
          q: () => 42,
          r: () => 42,
          s: () => 42,
          t: () => 42,
          u: () => 42,
          v: () => 42,
          w: () => 42,
          x: () => 42,
          y: () => 42,
          z: () => 42,
        },
      };

      // Instantiate WASM dengan imports
      const wasmInstance = await WebAssembly.instantiate(wasmModule, imports);
      const { resize } = wasmInstance.instance.exports;

      // Buat buffer untuk output
      const input = new Uint8Array(imgBuffer);
      const output = new Uint8Array(input.length);

      resize(input, output, 200, 200); // Sesuaikan ukuran

      return new Response(output, {
        headers: { "Content-Type": "image/jpeg" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
