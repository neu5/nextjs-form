import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { User, GroupsTable } from './definitions_TO_REMOVE/definitions';

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchGroups() {
  noStore();

  try {
    const data = await sql<GroupsTable>`SELECT * FROM groups`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups data.');
  }
}

export async function fetchPaths() {
  noStore();

  try {
    const data = await sql<GroupsTable>`SELECT * FROM paths`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch paths data.');
  }
}
