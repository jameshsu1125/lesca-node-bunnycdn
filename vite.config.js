import { resolve } from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dtsPlugin from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    root: resolve(import.meta.dirname, 'src'),
    publicDir: resolve(import.meta.dirname, 'public'),
    build: {
        emptyOutDir: true,
        outDir: '../lib',
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'index',
            fileName: 'index',
            formats: ['es', 'cjs'],
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                math: 'always',
                globalVars: {
                    mainColor: 'red',
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'src'),
        },
    },
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
    plugins: [
        cssInjectedByJsPlugin(),
        dtsPlugin({
            insertTypesEntry: true,
            outDirs: '../lib',
            tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
            entryRoot: resolve(import.meta.dirname, 'src'),
            include: [
                resolve(import.meta.dirname, 'src/index.ts'),
                resolve(import.meta.dirname, 'src/type.ts'),
            ],
        }),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            protocolImports: true,
        }),
    ],
    server: {
        open: true,
        port: 5173,
    },
});
