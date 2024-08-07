const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/db')
const cron = require('node-cron');

app.use(bodyParser.json());
app.use(cors());
// app.use(cors({
//     origin: 'https://prod.d39pyo3sxrr0ns.amplifyapp.com/'
// }));

const multer = require('multer')
const { applicationSignup, displayTeam, getTeam, deleteTeam, updateTeam } = require("./controller/DB/controller/application_Controller")
const { resourceCount } = require("./controller/dashboard/resources/resources.controller")
const { getTaggedResources } = require("./controller/dashboard/tagBasedResources/tagreport");
const { costdetails, customCostDetails } = require("./controller/dashboard/cost/cost.controller")
const { userSignUp, userLogIn, displayUser, getUser, deleteUsers, updateUser, changePassword } = require("./controller/DB/controller/user_controller")
const costcontroller = require("./controller/DB/controller/cost_controller")
const resourceCostConttoller = require("./controller/DB/controller/resourceCost_controller")
const { getCostOfAllResources } = require('./controller/dashboard/resourseLevelCost/resourcelevelcost.controller');
const { authenticateToken } = require("./controller/DB/utils/middleware")


const { fileUpload } = require("./controller/DB/utils/file_upload")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });





cron.schedule('10 15 * * *', async () => {
    console.log('Starting scheduled job to get and save AWS cost...');
    await costcontroller.getAndSaveAwsCost();
    await resourceCostConttoller.updateResourceLevelCost();
    console.log("completed");
});


app.get('/costdetails', costdetails)
app.get('/resourceCount', resourceCount)
app.get('/getTaggedResources', getTaggedResources);
app.get('/resourceLevelCost', getCostOfAllResources)






app.post('/signup', userSignUp)
app.post('/login', userLogIn)
app.get('/users', authenticateToken, displayUser)
app.get('/users/:_id', authenticateToken, getUser)
app.put('/users/changePassword', authenticateToken, changePassword)
app.put('/users/:_id', authenticateToken, updateUser)
app.delete('/users/:_id', authenticateToken, deleteUsers)




app.post("/upload", upload.single('file'), fileUpload)


app.get("/getAndSaveAwsCost", costcontroller.getAndSaveAwsCost)
app.get("/updateAwsCost", costcontroller.updateAwsCost)
app.get("/costs", costcontroller.displayCost)
app.get("/costbyresource", resourceCostConttoller.updateResourceLevelCost)
app.get("/getcostbyresource", resourceCostConttoller.displayResourceLevelCost)
app.post('/costdetails/custom', customCostDetails)



app.post('/teams', authenticateToken, applicationSignup)
app.get('/teams', authenticateToken, displayTeam)
app.delete('/teams/:_id', authenticateToken, deleteTeam)
app.get('/teams/:_id', authenticateToken, getTeam)
app.put('/teams/:_id', authenticateToken, updateTeam)




app.get("/", (req, res) => {
    res.send("welcome to backend ")
})
app.listen(5000, () => {
    console.log('Server started on port 5000');
});