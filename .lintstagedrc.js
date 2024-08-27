module.exports = {
  "*.{ts,tsx}": () => "pnpm run type-check",
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
};
