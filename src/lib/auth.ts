import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function verifyToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        throw new Error('No token provided');
    }

    const decoded = verify(token.value, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
            id: true,
            email: true,
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

export async function requireAuth() {
    try {
        return await verifyToken();
    } catch {
        throw new Error('Unauthorized');
    }
}

export async function login(username: string, password: string) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
}

export async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST'
        });
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
}

export async function getUser() {
    try {
        return await requireAuth();
    } catch {
        return null;
    }
}
