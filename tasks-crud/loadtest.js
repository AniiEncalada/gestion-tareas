const artillery = require("artillery");

const config = {
  target: "https://localhost:8080/api/v1/task", // replace with your target URL
  phases: [
    {
      duration: 10, // 1 minute
      arrivalRate: 10, // 10 users per second
    },
  ],
  defaults: {
    headers: {
      "User-Agent": "Artillery Load Test",
    },
  },
};

artillery.run(config, (err, results) => {
  if (err) {
    console.error(err);
  } else {
    const csvRows = results.scenarios.map((scenario) => {
      return [
        scenario.name,
        scenario.requests.count,
        scenario.requests.meanResponseTime,
        scenario.requests.maxResponseTime,
        scenario.requests.minResponseTime,
        scenario.errors.count,
      ];
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    fs.writeFileSync("results.csv", csvContent);
    console.log("Results exported to results.csv");
  }
});
