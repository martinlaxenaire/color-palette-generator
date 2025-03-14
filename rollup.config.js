import esbuild, { minify } from 'rollup-plugin-esbuild'

export default [
  {
    plugins: [esbuild()],
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
      },
      {
        file: 'dist/color-palette-generator.umd.js',
        format: 'umd',
        name: 'window',
        extend: true,
      },
      {
        file: 'dist/color-palette-generator.umd.min.js',
        format: 'umd',
        name: 'window',
        extend: true,
        plugins: [
          minify({
            keepNames: true,
          }),
        ],
        sourcemap: true,
      },
    ],
  },
]
