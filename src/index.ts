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
import StatusRouter from './Routes/StatusRoutes';
import MessageRouter from './Routes/MessageRouter';
import { AddContact, DeleteMessageCount, GetContact, GetUserSocketID, SetSocket, SetUserOffline, UpdateContact, UpdatelastMessage, UpdatelastMessage2 } from './utils/Action';
import { PostMessage } from './utils/PostMessage';




const corsWithOptions = {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
    credentials: true,
}


const app: any = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
        credentials: true,
    }
});


io.on("connection", (socket: any) => {

    socket.on("connection", (data: any) => {
        SetSocket({ id: data.id, socket: socket.id });
        socket.broadcast.emit("user-online", { data: data?.id });
    });


    socket.on("send-message", async (data: any) => {
        const user = await GetUserSocketID(data.consumer);
        const isUserPresentInContact = await GetContact({ consumer: data.consumer, publisher: data.publisher });
        const message = await PostMessage(data);
        if (isUserPresentInContact) {
            io.to(user?.socket_id).emit("new-message", { data: message });
            UpdateContact(data);
        }
        else {
            await AddContact({ consumer: data.consumer, publisher: data.publisher });
            io.to(user?.socket_id).emit("new-message", { data: data });
        }
        UpdatelastMessage(data);
        UpdatelastMessage2(data);
        socket.emit("message-sent", { data: message });
    });

    socket.on('seen', async (data: any) => {
        await DeleteMessageCount(data);
    })

    socket.on("media-message", async (data: any) => {
        const user = await GetUserSocketID(data.data.consumer);
        const isUserPresentInContact = await GetContact({ consumer: data.data.consumer, publisher: data.publisher });
        if (isUserPresentInContact) {
            io.to(user?.socket_id).emit("new-message", { data: data.data });
            UpdateContact(data);
        }
        else {
            await AddContact({ consumer: data.consumer, publisher: data.data.publisher });
            io.to(user?.socket_id).emit("new-message", { data: data.data });
        }
        UpdatelastMessage({
            mediaType: data.data.mediaType,
            message: data.data.message,
            mediaDuration: data.data.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
        UpdatelastMessage2({
            mediaType: data.data.mediaType,
            message: data.data.message,
            mediaDuration: data.data.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
    });

    socket.on("send-file-message", async (data: any) => {
        const user = await GetUserSocketID(data.data.consumer);
        const isUserPresentInContact = await GetContact({ consumer: data.data.consumer, publisher: data.publisher });
        if (isUserPresentInContact) {
            io.to(user?.socket_id).emit("new-message", { data: data.data });
            UpdateContact(data);
        }
        else {
            await AddContact({ consumer: data.consumer, publisher: data.data.publisher });
            io.to(user?.socket_id).emit("new-message", { data: data.data });
        }
        UpdatelastMessage({
            mediaType: data.data.mediaType,
            message: data.data.media,
            mediaDuration: data.data?.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
        UpdatelastMessage2({
            mediaType: data.data.mediaType,
            message: data.data.media,
            mediaDuration: data.data?.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
    });

    socket.on("message-seen", async (data: any) => {
        const user = await GetUserSocketID(data.data);
        io.to(user?.socket_id).emit("message-seen-ack", { data: data.reciver });
    });

    socket.on("message-recived", async (data: any) => {
        socket.broadcast.emit("message-recived-ack", { data: data });
    });

    socket.on("disconnect", async () => {
        const data: any = await SetUserOffline({ socketId: socket.id });
        if (data) {
            socket.broadcast.emit("user-offline", { data: data?._id });
        }
    });

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
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }));
}

app.use(cors(corsWithOptions));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));
app.use("/api/users", UserRouter);
app.use("/api/status", StatusRouter);
app.use("/api/messages", MessageRouter);

app.get("/", (req: Request, res: Response) => {
    res.render('index')
})


server.listen(port, () => {
    console.log("Server Running at ", port)
})