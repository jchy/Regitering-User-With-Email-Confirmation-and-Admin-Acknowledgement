const express = require('express');
const connect = require('./src/config/db');

const PORT = 3000;

const app = express();
app.use(express.json());

const {signup , signin} = require('./src/controllers/auth.controller');
const userController = require('./src/controllers/user.controller');

app.post("/register", signup);
app.post("/signin", signin);

app.use("/users", userController);

const start = async () => {
    await connect();
    
    app.listen(PORT, () =>{
        console.log(`Listening on port ${PORT}`);
    })
}
module.exports =start;