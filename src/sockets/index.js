import { Server } from 'socket.io'
import { registerChatSocket } from './chat.socket.js'

import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const getCookieValue = (cookieHeader, name) => {
    return cookieHeader
        ?.split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`))
        ?.split('=')[1];
};

export const setupSocket = (httpServer, allowedOrigins) => {
    const io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        const token = getCookieValue(socket.handshake.headers.cookie, 'accessToken');

        if (!token) {
            socket.user = null;
            return next();
        }

        try {
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedUser.user_Id).select('username display_name role');

            socket.user = user
                ? {
                    user_Id: user._id.toString(),
                    username: user.username,
                    display_name: user.display_name,
                    role: user.role,
                }
                : null;

            return next();
        } catch {
            socket.user = null;
            return next();
        }
    });

    io.on('connection', (socket) => {
        registerChatSocket(io, socket);
    });

    return io;
};
