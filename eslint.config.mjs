import nextConfig from "eslint-config-next";

export default [
  {
    ignores: [
      ".next/**",
      "tmp/**",
      "node_modules/**",
      "convex/_generated/**",
      ".vercel/**",
      ".junie/**",
      ".zed/**",
      ".trae/**",
      ".windsurf/**",
      "out/**",
      "build/**",
      "next-env.d.ts"
    ]
  },
  ...nextConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
      "react/display-name": "off",
      "react-hooks/static-components": "off",
      "react-hooks/purity": "off",
    }
  }
];
