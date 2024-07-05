const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// const db = require('./config/db')


app.use(bodyParser.json());
app.use(cors());


const { resourceCount } = require("./controller/dashboard/resources/resources.controller")
const { getTaggedResources } = require("./controller/dashboard/tagBasedResources/tagreport");
const { costdetails } = require("./controller/dashboard/cost/cost.controller")
const {getCostOfAllResources} = require('./controller/dashboard/resourseLevelCost/resourcelevelcost.controller');




app.get('/costdetails', costdetails)
app.get('/resourceCount', resourceCount)
app.get('/getTaggedResources', getTaggedResources);
app.get('/resourceLevelCost',getCostOfAllResources)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});