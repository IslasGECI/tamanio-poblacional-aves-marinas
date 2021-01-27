
module.exports = function(config) {
    config.set({
      mutate: ["./src/index.js"],
      mutator: "javascript",
      packageManager: "npm",
      reporters: ["html", "clear-text", "progress"],
      testRunner: "jest",
      transpilers: [],
      coverageAnalysis: "off"
    });
  }