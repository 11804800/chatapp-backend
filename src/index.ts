import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import UserRouter from './Routes/UserRoutes';
import passport from 'passport';
import { Server } from 'socket.io';
import http from 'http';



const corsWithOptions = {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}


const app: any = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
});

io.on("connection", (socket: any) => {
    console.log("new connection",socket.id);
    socket.emit("welcome","Welcome to the server");
});


const Mongo_url: any = process.env.MONGO_URL;
const port: string | undefined = process.env.PORT || '5000';



mongoose.connect(Mongo_url).then((db: any) => {
    console.log('Connection established')
}).catch((err) => {
    console.log(err)
});

const Secret_key = process.env.SECRET_KEY;
if (Secret_key) {
    app.use(session({
        secret: Secret_key,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));
}





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(passport.initialize());
app.use(cors(corsWithOptions));


app.use("/api/users", UserRouter);

app.get("/", (req: Request, res: Response) => {
    res.render('index')
})


server.listen(port, () => {
    console.log("Server Running at ", port)
})