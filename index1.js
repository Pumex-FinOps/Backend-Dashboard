const AWS = require("./config/aws");

let costExplorer = new AWS.CostExplorer();

const params = {
    TimePeriod: {
      Start: '2023-05-01', // The start date in YYYY-MM-DD format
      End: '2023-05-31'    // The end date in YYYY-MM-DD format
    },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost'],
    // Filter: {
    //   Tags: {
    //     Key: 'ApplicationName', // Replace with your tag key
    //     Values: ['FinOps'] // Replace with your tag values
    //   }
    // }
  };
  
  // Call the GetCostAndUsage API
  costExplorer.getCostAndUsage(params, (err, data) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Cost and Usage Data:', JSON.stringify(data, null, 2));
    }
  });