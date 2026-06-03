import crypto from 'crypto';

export const registerChatSocket = (io, socket) => {
    socket.on('join_live_chat', ({ liveId }) => {
        if (!liveId) return;
        socket.join(`live:${liveId}`);
    });

    socket.on('send_live_message', ({ liveId, text }) => {
        const cleanText = String(text || '').trim().slice(0, 140);
        if (!liveId || !cleanText) return;

        const userId = socket.user?.user_Id || socket.id;
        const username = socket.user?.display_name || socket.user?.username || 'guest';

        io.to(`live:${liveId}`).emit('receive_live_message', {
            id: crypto.randomUUID(),
            liveId,
            userId,
            user: username,
            text: cleanText,
            color: '#7BAEFF',
            createdAt: new Date().toISOString(),
        });
    });

    socket.on('leave_live_chat', ({ liveId }) => {
        if (!liveId) return;
        socket.leave(`live:${liveId}`);
    });
};
