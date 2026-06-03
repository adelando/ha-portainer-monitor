import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/portainer-monitor-card.ts",
  output: {
    file: "dist/portainer-monitor-card.js",
    format: "es",
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
  external: [],
};
