const custom = require("@digitalroute/cz-conventional-changelog-for-jira/configurable");

module.exports = custom({
  list: ["feat", "fix", "test", "docs", "chore"],
  jiraPrepend: "[",
  jiraAppend: "]",
  exclamationMark: true,
  jiraPrefix: "GIT",
  types: {
    feat: {
      description: "✨ A new feature",
    },
    fix: {
      description: "🪲 A bug fix",
    },
    docs: {
      description: "📖 Documentation only changes",
    },
    test: {
      description: "🧪 Adding missing tests or correcting existing tests",
    },
    chore: {
      description: "🚧 Other changes that don't modify src or test files",
    },
  },
  skipScope: true,
});

module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*):\s\[(\w*-\d+)\]\s(.*)$/,
      headerCorrespondence: ["type", "ticket", "subject"],
    },
  },
  rules: {
    "jira-ticket": [2, "always"],
    "subject-empty": [2, "never"],
    "subject-good": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "jira-ticket": (config) => {
          const { ticket } = config;
          return [
            ticket?.match(/[A-Z]+-[0-9]+/),
            `Your subject should contain the JIRA ticket`,
          ];
        },
        "subject-good": (config) => {
          const { subject } = config;
          return [
            subject?.match(
              /^(?!(\b(testing|updated|update|test|wip|initial|setup|create)\b)$)\w+\s+\w+.*$/i
            ),
            `Please use a meaningful commit message. Please refrain using only one word as the commit message`,
          ];
        },
      },
    },
  ],
};
