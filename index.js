const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
<<<<<<< HEAD

const multer = require('multer')
const { resourceCount } = require("./controller/dashboard/resources/resources.controller")
const { costdetails } = require("./controller/dashboard/cost/cost.controller")
const { addNewUser } = require("./controller/DB/User/User.controller")
const { fileUpload } = require("./controller/DB/file_upload")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.get('/costdetails', costdetails)
app.get('/resourceCount', resourceCount)
app.post('/newuser', addNewUser)



app.post("/upload", upload.single('file'), fileUpload)


=======
 const{resourceCount}=require("./controller/dashboard/resources/resources.controller")
 const{costdetails} =  require("./controller/dashboard/cost/cost.controller")
 const{addApplicationTeam} = require("./controller/DB/Team/Team.controller")

 app.get('/costdetails',costdetails)
app.get('/resourceCount',resourceCount)
app.post('/addApplicationTeam',addApplicationTeam)
>>>>>>> 347343994161f861f9fd2a5686cd710db59920dd

app.listen(3000, () => {
    console.log('Server started on port 3000');
});