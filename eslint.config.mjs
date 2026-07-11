import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", "data/**", "*.config.*"] },
  ...next,
  { rules: { "@next/next/no-page-custom-font": "off" } },
];

export default config;
