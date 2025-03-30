import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { messageId } = body;

        const connection = await getConnection();

        const query = `
            UPDATE messages
            SET isDeleted = 1
            WHERE messageId = ?
        `;

        const [result] = await connection.execute(query, [messageId]);
        await connection.end();

        return NextResponse.json(
            {
                message: 'Message deleted successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { message: 'Error deleting message', error: error.message },
            { status: 500 }
        );
    }
}