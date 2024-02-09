import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { User, GroupsTable, PathForm } from './definitions';

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
    const data =
      await sql<GroupsTable>`SELECT groups.id, groups.name, groups.date, paths.name AS pathName FROM groups JOIN paths ON groups.path_id = paths.id`;

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

export async function fetchPathById(id: string) {
  noStore();

  try {
    const data = await sql<PathForm>`
      SELECT
        paths.id,
        paths.name
      FROM paths
      WHERE paths.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch path.');
  }
}
