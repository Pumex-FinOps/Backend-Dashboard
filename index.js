const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
 // Enable CORS for all routes, you can configure it as needed
 const{resourceCount}=require("./controller/resourceCount")
 const{costdetails} =  require("./controller/cost/cost")

 app.get('/costdetails',costdetails)
app.get('/resourceCount',resourceCount)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});