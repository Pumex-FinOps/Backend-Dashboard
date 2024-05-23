const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
 // Enable CORS for all routes, you can configure it as needed
 const{resourceCount}=require("./controller/dashboard/resources/resources.controller")
 const{costdetails} =  require("./controller/dashboard/cost/cost.controller")

 app.get('/costdetails',costdetails)
app.get('/resourceCount',resourceCount)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});