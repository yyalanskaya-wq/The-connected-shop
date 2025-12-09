const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "znkvr5",
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
  reportDir: "cypress/reports",
  overwrite: true,
  html: true,
  json: true,
  charts: true,
  reportPageTitle: "The Connected Shop Test Report",
  embeddedScreenshots: true,
  inlineAssets: true,
  saveAllAttempts: false,
  embeddedScreenshots: true,
  timestamp: "mmddyyyy_HHMMss"
},
  e2e: {
    setupNodeEvents(on, config) {
    require('cypress-mochawesome-reporter/plugin')(on);
    return config;
    },
  },
  env: {apiBaseUrl: 'https://dev.emeli.in.ua/wp-json/wp/v2'}
});
