import wasmModule from './djpeg-static.wasm';

export default {
    async fetch(request, env, ctx) {
        // WASM sudah otomatis di-load oleh bundler
        const { instance } = await WebAssembly.instantiate(wasmModule, {
            env: {
                memory: new WebAssembly.Memory({ initial: 256 }),
                console_log: (val) => console.log("WASM log:", val),
            }
        });

        console.log("Exports:", instance.exports);

        // Coba panggil fungsi ekspor
        if (instance.exports.m) {
            const result = instance.exports.m(10, 20);
            return new Response(`Hasil dari WASM: ${result}`);
        }

        return new Response("Modul WASM berhasil di-load, tapi fungsi tidak ditemukan.");
    }
};
