import { rename } from "node:fs/promises";
import { build } from "esbuild";

const salidaTemporal = "dist/servidor.cjs";

await build({
  entryPoints: ["dist/main.js"],
  outfile: salidaTemporal,
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  keepNames: true,
  external: [
    "@nestjs/microservices",
    "@nestjs/microservices/*",
    "@nestjs/websockets",
    "@nestjs/websockets/*",
  ],
  // Vercel elige el entrypoint si el archivo menciona este require.
  banner: { js: '/* require("@nestjs/core") */' },
});

await rename(salidaTemporal, "dist/main.js");
