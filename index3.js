const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/db')


app.use(bodyParser.json());
app.use(cors());

const multer = require('multer')
const { resourceCount } = require("./controller/dashboard/resources/resources.controller")
const { getTaggedResources } = require("./controller/dashboard/tagBasedResources/tagreport");
//const { addApplicationTeam } = require("./controller/DB/Team/Team.controller")
const { costdetails } = require("./controller/dashboard/cost/cost.controller")
const { userSignUp, userLogIn, displayUser, getUser, deleteUsers } = require("./controller/DB/controller/user_controller")
const ticketController = require("./controller/DB/controller/ticket_controller")
const { fileUpload } = require("./controller/DB/utils/file_upload")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.get('/costdetails', costdetails)
app.get('/resourceCount', resourceCount)
app.get('/getTaggedResources', getTaggedResources);



app.post('/newuser', userSignUp)
// app.get("/getuser/:empId", getUserbyId)
// app.get("/getalluser", getAllUser)


app.post('/signup', userSignUp)
app.post('/login', userLogIn)
app.get('/users', displayUser)
app.get('/users/:_id', getUser)
//app.put('/users/:_id', updateUser)
app.delete('/users/:_id', deleteUsers)



app.post('/tickets', ticketController.createTicket);
app.get('/tickets', ticketController.getAllTickets);
app.get('/tickets/:id', ticketController.getTicketById);
app.put('/tickets/:id', ticketController.updateTicket);
app.delete('/tickets/:id', ticketController.deleteTicket);
app.get('/tickets/assigned-to-member/:memberId', ticketController.getTicketsByAssignedMember);
app.get('/tickets/assigned-to-team/:teamId', ticketController.getTicketsByTeam);
app.get('/tickets/assigned-to-user/:userId', ticketController.getTicketsByUserId);



app.post('/comments', createComment);
app.get('/comments/ticket/:ticketId', getCommentsByTicketId);
app.get('/comments/user/:userId', getCommentsByUserId);
app.put('/comments/:id', updateComment);
app.delete('/comments/:id', deleteComment);

// app.post("/upload", upload.single('file'), fileUpload)





app.listen(3000, () => {
    console.log('Server started on port 3000');
});