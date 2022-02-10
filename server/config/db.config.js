import mongoose from 'mongoose';
require('dotenv').config();


const connectionURL = process.env.MONGODB_KEY
const mongoConnect = () => {
    mongoose.connect(connectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection
        .once('open', () => console.log('Database connected succefully'))
        .on('error', error => console.log(error))
}

export default mongoConnect;
