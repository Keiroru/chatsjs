import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'chatdb',
        });

        const [conversationRows] = await connection.execute(`
          SELECT Conversations.conversationId, ConversationUsers.userId as friendId
          FROM Conversations
          JOIN ConversationUsers ON Conversations.conversationId = ConversationUsers.conversationId
          JOIN ConversationUsers AS ConversationUsers2 ON Conversations.conversationId = ConversationUsers2.conversationId
          WHERE ConversationUsers2.userId = ? AND ConversationUsers.userId != ?
        `, [userId, userId]);

        if (conversationRows.length === 0) {
            return NextResponse.json([]);
        }

        const conversationIds = conversationRows.map(row => row.conversationId);

        const conversationToFriendMap = {};
        conversationRows.forEach(row => {
            conversationToFriendMap[row.conversationId] = row.friendId;
        });

        const placeholders = conversationIds.map(() => '?').join(',');
        const [messageRows] = await connection.execute(`
          SELECT Messages.*
          FROM Messages
          INNER JOIN (
            SELECT conversationId, MAX(sentAt) as maxSentAt
            FROM Messages
            WHERE conversationId IN (${placeholders})
            GROUP BY conversationId
          ) AS LatestMessages ON Messages.conversationId = LatestMessages.conversationId AND Messages.sentAt = LatestMessages.maxSentAt
        `, [...conversationIds]);

        const lastMessages = messageRows.map(msg => ({
            ...msg,
            friendId: conversationToFriendMap[msg.conversationId]
        }));

        return NextResponse.json(lastMessages);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch messages', details: error.message }, { status: 500 });
    } finally {
        if (connection) await connection.end();
    }
}