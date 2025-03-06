export default {
    async fetch(request, env, ctx) {
        // URL file WASM, ganti dengan lokasi file lo
        const wasmUrl = "./djpeg-static.wasm";

        // Ambil WASM dari URL
        const response = await fetch(wasmUrl);
        const wasmBuffer = await response.arrayBuffer();

        // Inisialisasi WASM dengan objek import kosong (atau sesuaikan)
        const { instance } = await WebAssembly.instantiate(wasmBuffer, {
            env: {
                memory: new WebAssembly.Memory({ initial: 256 }),
                console_log: (val) => console.log("WASM log:", val),
            }
        });

        // Debug: Cek fungsi yang diekspor
        console.log("Exports:", instance.exports);

        // Contoh panggil fungsi ekspor
        if (instance.exports.m) {
            const result = instance.exports.m(10, 20); // Sesuaikan param
            return new Response(`Hasil dari WASM: ${result}`);
        }

        return new Response("Modul WASM berhasil di-load, tapi fungsi tidak ditemukan.");
    }
};
