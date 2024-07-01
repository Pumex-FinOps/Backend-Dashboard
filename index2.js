const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/db')


app.use(bodyParser.json());
app.use(cors());

const multer = require('multer')

const { applicationSignup,displayTeam,getTeam,deleteTeam} = require("./controller/DB/controller/application_Controller")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/login', applicationSignup)
app.get('/teams',displayTeam)  
app.delete('/teams/:_id',deleteTeam)
app.get('/teams/:_id',getTeam)

// app.get("/getuser/:empId", getUserbyId)
// app.get("/getalluser", getAllUser)








// app.post("/upload", upload.single('file'), fileUpload)



app.listen(4000, () => {
    console.log('Server started on port 4000');
});