import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  User,
  GroupsTable,
  PathsTable,
  PathForm,
  LeavingHoursPathForm,
  LeavingHoursTable,
  LeavingHoursTransportForm,
  ShirtsSizesList,
  ShirtsTypesList,
  TransportForm,
  TransportsTable,
} from './definitions';

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
    const data = await sql<GroupsTable>`
        SELECT 
          groups.id, 
          groups.name, 
          groups.datetime, 
          paths.name AS pathName 
        FROM groups 
        JOIN paths ON groups.path_id = paths.id`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups data.');
  }
}

export async function fetchPaths() {
  noStore();

  try {
    const data = await sql<PathsTable>`SELECT * FROM paths`;

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

export async function fetchLeavingHours() {
  noStore();

  try {
    const data = await sql<LeavingHoursTable>`SELECT * FROM leaving_hours`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch leaving hours data.');
  }
}

export async function fetchPathsLeavingHours() {
  noStore();

  try {
    const data = await sql<LeavingHoursPathForm>`
      SELECT
        paths_leaving_hours.path_id,
        paths_leaving_hours.leaving_hour_id
      FROM paths_leaving_hours
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch path leaving hours.');
  }
}

export async function fetchPathLeavingHours(id: string) {
  noStore();

  try {
    const data = await sql<LeavingHoursPathForm>`
      SELECT
        leaving_hour_id
      FROM paths_leaving_hours
      WHERE path_id = ${id};
    `;

    return data.rows.reduce((result: Array<string>, row) => {
      if (row.leaving_hour_id) {
        result.push(row.leaving_hour_id);
      }

      return result;
    }, []);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch path leaving hours.');
  }
}

export async function fetchPathsWithItsLeavingHours() {
  noStore();

  const [paths, leavingHours, pathsLeavingHours] = await Promise.all([
    fetchPaths(),
    fetchLeavingHours(),
    fetchPathsLeavingHours(),
  ]);

  return paths.map((path) => ({
    ...path,
    leavingHours: pathsLeavingHours
      .filter((pathLeavingHour) => pathLeavingHour.path_id === path.id)
      .map((pathLeavingHour) =>
        leavingHours.find(
          (leavingHour) => leavingHour.id === pathLeavingHour.leaving_hour_id,
        ),
      ),
  }));
}

export async function fetchShirtsTypes() {
  noStore();

  try {
    const data = await sql<ShirtsTypesList>`SELECT id, value FROM shirts_types`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch paths data.');
  }
}

export async function fetchShirtsSizes() {
  noStore();

  try {
    const data = await sql<ShirtsSizesList>`SELECT id, value FROM shirts_sizes`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch paths data.');
  }
}

export async function fetchGroupById(id: string) {
  noStore();

  try {
    const data = await sql<PathForm>`
      SELECT
        groups.name,
        groups.submitting_person_email,
        groups.chef_group_phone_number,
        groups.remarks,
        members.name as memberName,
        members.group_id as groupId,
        members.id as memberId,
        members.shirt_size_id,
        members.shirt_type_id,
        members.birthday_date,
        members.pttk_card_number,
        members.is_group_chef
      FROM groups
      JOIN members ON groups.id = members.group_id
      WHERE groups.id = ${id}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group.');
  }
}

export async function fetchTransports() {
  noStore();

  try {
    const data = await sql<TransportsTable>`SELECT id, name FROM transports`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transports data.');
  }
}

export async function fetchTransportById(id: string) {
  noStore();

  try {
    const data = await sql<TransportForm>`
      SELECT
        transports.id,
        transports.name
      FROM transports
      WHERE transports.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transport.');
  }
}

export async function fetchTransportLeavingHours(id: string) {
  noStore();

  try {
    const data = await sql<LeavingHoursTransportForm>`
      SELECT
        leaving_hour_id
      FROM transports_leaving_hours
      WHERE transport_id = ${id};
    `;

    return data.rows.reduce((result: Array<string>, row) => {
      if (row.leaving_hour_id) {
        result.push(row.leaving_hour_id);
      }

      return result;
    }, []);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transport leaving hours.');
  }
}

export async function fetchTransportsLeavingHours() {
  noStore();

  try {
    const data = await sql<LeavingHoursTransportForm>`
      SELECT
        transports_leaving_hours.transport_id,
        transports_leaving_hours.leaving_hour_id
      FROM transports_leaving_hours
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transports leaving hours.');
  }
}

export async function fetchTransportsWithItsLeavingHours() {
  noStore();

  const [transports, leavingHours, transportsLeavingHours] = await Promise.all([
    fetchTransports(),
    fetchLeavingHours(),
    fetchTransportsLeavingHours(),
  ]);

  return transports.map((transport) => ({
    ...transport,
    leavingHours: transportsLeavingHours
      .filter(
        (transportsLeavingHour) =>
          transportsLeavingHour.transport_id === transport.id,
      )
      .map((transportsLeavingHour) =>
        leavingHours.find(
          (leavingHour) =>
            leavingHour.id === transportsLeavingHour.leaving_hour_id,
        ),
      ),
  }));
}
