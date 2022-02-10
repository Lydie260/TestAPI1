import express from 'express';
import bodyParser from 'body-parser'
import mongoConnect from './config/db.config';
import userRoutes from './routes/user.route';

const app = express();
const port = process.env.PORT || 6200

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use('/api', userRoutes);

app.get('/', (req, res)=>{
    res.status(200).json({
        message: "welcome",
        status: 200
    });
})

app.use( (req, res)=>{
    res.status(404).json({
        message: "opps endpoint not found",
        status: 404
    })
});

app.listen(port, console.log(`The server is running on http://127.0.0.1:${port}`));
mongoConnect();
