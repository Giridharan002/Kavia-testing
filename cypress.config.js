const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      // implement node event listeners here
    },
    testIsolation: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 60000
  },
});

