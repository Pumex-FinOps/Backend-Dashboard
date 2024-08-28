const AWS = require("./config/aws");
require('dotenv').config()
const {assumeRoleV2} = require("./config/assumeRole")
// Configure AWS SDK for Account A
AWS.config.update({ region: 'us-east-1' });

const sts = new AWS.STS();
let accountIds = process.env.ACCOUNT_IDS.split(',');

const express = require('express');
const { costdetails } = require('./controller/dashboard/cost/cost.controller');
const { resourceCount } = require("./controller/dashboard/resources/resources.controller")
const {getTaggedResources}= require("./controller/dashboard/tagBasedResources/tagreport")
const { getCostOfAllResources } = require('./controller/dashboard/resourseLevelCost/resourcelevelcost.controller');

const app = express();

app.use(express.json());

app.get('/costdetails', costdetails)
app.get('/resourceCount', resourceCount)
app.get('/tagreport',getTaggedResources)
app.get('/resourceLevel',getCostOfAllResources)
app.get("/", (req, res) => {
  res.send("welcome to backend ")
})
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
