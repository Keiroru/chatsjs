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

        const [results] = await connection.execute(`
           SELECT messages.*, 
       (
            SELECT userId 
            FROM conversationusers 
            WHERE conversationId = messages.conversationId AND userId != ? 
            LIMIT 1
       ) AS friendId
FROM messages
INNER JOIN (
       SELECT conversationId, MAX(sentAt) AS maximumSentAt
       FROM messages
       GROUP BY conversationId
) AS latestMessages ON messages.conversationId = latestMessages.conversationId 
                     AND messages.sentAt = latestMessages.maximumSentAt
WHERE messages.conversationId IN (
       SELECT conversationId 
       FROM conversationusers 
       WHERE userId = ?
)
GROUP BY messages.conversationId;
        `, [userId, userId]);

        return NextResponse.json(results);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    } finally {
        if (connection) await connection.end();
    }
}