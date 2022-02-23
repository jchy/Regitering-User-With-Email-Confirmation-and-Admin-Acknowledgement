const mongoose=require('mongoose');

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/assignment_5493")
}

module.exports = connect;