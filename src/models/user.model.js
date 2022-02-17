const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minLength:6}
},{
    timestamps: { created_at: () => Date.now() }
});

// pre save hook is provided by mongoose this says that before you save the document 
// Please do this then save the document

userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();
 
    bcrypt.hash(this.password, 8, (err, hash) => {
        if(err) return next(err);

        this.password = hash;
        next();
    })

})

userSchema.methods.checkPassword = function(password){
    const passwordHash = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same)=>{
            // console.log("err, same", err, same);
            if(err) return reject(err);

            resolve(same);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = User;