import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let connection;
    try {
        connection = await getConnection();

        // Modified query to ensure only one row per conversation
        const [results] = await connection.execute(`
            SELECT m.*, 
                  (SELECT userId FROM conversationusers 
                   WHERE conversationId = m.conversationId AND userId != ? 
                   LIMIT 1) as friendId
            FROM messages m
            INNER JOIN (
                SELECT conversationId, MAX(sentAt) as maxSentAt
                FROM messages
                GROUP BY conversationId
            ) latest ON m.conversationId = latest.conversationId AND m.sentAt = latest.maxSentAt
            WHERE m.conversationId IN (
                SELECT conversationId FROM conversationusers WHERE userId = ?
            )
            GROUP BY m.conversationId
        `, [userId, userId]);

        return NextResponse.json(results);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    } finally {
        if (connection) await connection.end();
    }
}