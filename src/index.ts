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
import { AddContact, DeleteMessageCount, GetContact, GetUserSocketID, SetSocket, SetUserOffline, UpdateContact, UpdatelastMessage, UpdatelastMessage2, UpdateMessage } from './utils/Action';
import { PostMessage } from './utils/PostMessage';



const allowedOrigins = [
    'https://chatapp-frontend-7c7g.vercel.app'
];

const corsWithOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};




const app: any = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200
    }
});


io.on("connection", (socket: any) => {

    socket.on("connection", (data: any) => {
        SetSocket({ id: data.id, socket: socket.id });
        socket.broadcast.emit("user-online", { data: data?.id });
    });

    socket.on("start-typing", async (data: any) => {
        const user = await GetUserSocketID(data.consumer);
        if (user) {
            io.to(user?.socket_id).emit("user-typing", data);
        }
    });

    socket.on("end-typing", async (data: any) => {
        const user = await GetUserSocketID(data.consumer);
        if (user) {
            io.to(user?.socket_id).emit("user-stopped-typing", data);
        }
    })


    socket.on("send-message", async (data: any) => {
        const user = await GetUserSocketID(data.consumer);
        const isUserPresentInContact = await GetContact({ consumer: data.consumer, publisher: data.publisher });
        const message = await PostMessage(data);
        if (isUserPresentInContact) {
            io.to(user?.socket_id).emit("new-message", { data: message });
            await UpdateContact(data);
        }
        else {
            await AddContact({ consumer: data.consumer, publisher: data.publisher });
            io.to(user?.socket_id).emit("new-message", { data: data });
        }
        await UpdatelastMessage(data);
        await UpdatelastMessage2(data);
        socket.emit("message-sent", { data: message });
    });

    socket.on('seen', async (data: any) => {
        await DeleteMessageCount(data);
    });

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
        await UpdatelastMessage({
            mediaType: data.data.mediaType,
            message: data.data.message,
            mediaDuration: data.data.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
        await UpdatelastMessage2({
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
            await UpdateContact(data);
        }
        else {
            await AddContact({ consumer: data.consumer, publisher: data.data.publisher });
            io.to(user?.socket_id).emit("new-message", { data: data.data });
        }
        await UpdatelastMessage({
            mediaType: data.data.mediaType,
            message: data.data.mediaType == "audio" ? "audio" : data.data.media,
            mediaDuration: data.data?.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
        await UpdatelastMessage2({
            mediaType: data.data.mediaType,
            message: data.data.mediaType == "audio" ? "audio" : data.data.media,
            mediaDuration: data.data?.mediaDuration,
            publisher: data.data.publisher,
            consumer: data.data.consumer
        });
    });

    socket.on("reaction", async (data: any) => {
        const { messageId, consumer, reaction, publisher } = data;
        const MessageData: any = await UpdateMessage({ messageId, reaction });
        await UpdatelastMessage({
            message: "Reacted to message",
            publisher: publisher,
            consumer: consumer
        });
        await UpdatelastMessage2({
            message: "Reacted to message",
            publisher: publisher,
            consumer: consumer
        });
        await UpdateContact({
            message: "Reacted to message",
            publisher: publisher,
            consumer: consumer
        });
        const user = await GetUserSocketID(consumer);
        io.to(user?.socket_id).emit("new-reaction-message", { data: MessageData });

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
    res.send("<h1>Welcome to Express</h1>")
});
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});


server.listen(port, () => {
    console.log("Server Running at ", port)
})