const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
 const{resourceCount}=require("./controller/dashboard/resources/resources.controller")
 const{costdetails} =  require("./controller/dashboard/cost/cost.controller")
 const{addApplicationTeam} = require("./controller/DB/Team/Team.controller")

 app.get('/costdetails',costdetails)
app.get('/resourceCount',resourceCount)
app.post('/addApplicationTeam',addApplicationTeam)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});