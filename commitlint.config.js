const custom = require("@digitalroute/cz-conventional-changelog-for-jira/configurable");



module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*):\s\[(\w*-\d+)\]\s(.*)$/,
      headerCorrespondence: ["type", "ticket", "subject"],
    },
  },
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "test", "docs", "chore"]],
    "jira-ticket": [2, "always"],
    "subject-empty": [2, "never"],
  },
  plugins: [
    {
      rules: {
        "jira-ticket": ({ ticket }) => {
          return [
            ticket?.match(/[A-Z]+-[0-9]+/),
            "Your commit message should contain a JIRA ticket",
          ];
        },
      },
    },
  ],
};