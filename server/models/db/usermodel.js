import  mongoose  from 'mongoose';
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    names: String,
    email: String,
    password: String,
    roles: String,
    status: String,
})
const userModel = mongoose.model('users', userSchema)
export default userModel