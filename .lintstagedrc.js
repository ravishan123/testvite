export default {
  "*.{css,less,scss,html,json,jsx,js,ts,tsx}": "pnpm prettier --fix --ignore-unknown",
  "*.{jsx,js,ts,tsx}": ['pnpm eslint --fix', () => 'tsc -p tsconfig.json --noEmit'],
}