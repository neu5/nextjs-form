import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  Configuration,
  User,
  GroupsTable,
  PathsTable,
  PathsTypes,
  PathForm,
  LeavingHoursPathForm,
  LeavingHoursTable,
  LeavingHoursTransportForm,
  OrganizersTable,
  ShirtsSizesList,
  ShirtsTypesList,
  TransportForm,
  TransportsTable,
  UsersTable,
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

export async function fetchConfiguration() {
  noStore();

  try {
    const data = await sql<Configuration>`SELECT 
      is_form_enabled, 
      is_editing_for_users_enabled,
      is_mailing_enabled,
      is_ordering_shirts_enabled
    FROM configuration`;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch configuration.');
  }
}

export async function fetchFormConfiguration() {
  noStore();

  try {
    const data = await sql`SELECT is_form_enabled FROM configuration`;

    return data.rows[0].is_form_enabled as boolean;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch configuration.');
  }
}

export async function fetchUserEditingConfiguration() {
  noStore();

  try {
    const data =
      await sql`SELECT is_editing_for_users_enabled FROM configuration`;

    return data.rows[0].is_editing_for_users_enabled as boolean;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch configuration.');
  }
}

export async function fetchShirtOrderingConfiguration() {
  noStore();

  try {
    const data =
      await sql`SELECT is_ordering_shirts_enabled FROM configuration`;

    return data.rows[0].is_ordering_shirts_enabled as boolean;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch configuration.');
  }
}

export async function fetchGroups() {
  noStore();

  try {
    const data = await sql<GroupsTable>`
        SELECT 
          groups.id, 
          groups.name, 
          groups.creation_datetime,
          groups.last_edition_datetime,
          paths.name AS pathName 
        FROM groups 
        JOIN paths ON groups.path_id = paths.id`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups data.');
  }
}

export async function fetchGroupCount() {
  noStore();

  try {
    const data = await sql`
        SELECT COUNT(id) FROM groups`;

    return data.rows[0].count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups data.');
  }
}

export async function fetchMembersCount() {
  noStore();

  try {
    const data = await sql`
        SELECT COUNT(id) FROM members`;

    return data.rows[0].count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchMembersFees() {
  noStore();

  try {
    const data = await sql`
        SELECT fee FROM members`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchMembersGroupCount(id: string) {
  noStore();

  try {
    const data = await sql`
      SELECT COUNT(*) 
        FROM members 
        WHERE group_id = ${id}`;

    return data.rows[0].count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group data.');
  }
}

export async function fetchGroupChefByGroupId(id: string) {
  noStore();

  try {
    const data = await sql`
      SELECT
        members.name
      FROM members 
      WHERE group_id = ${id} AND is_group_chef = true`;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group data.');
  }
}

export async function fetchMembersWithPTTKCardCount() {
  noStore();

  try {
    const data = await sql`
        SELECT COUNT(pttk_card_number) FROM members WHERE pttk_card_number != ''`;

    return data.rows[0].count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchGroupsByEmailAddressCount(emailAddress: string) {
  noStore();

  try {
    const data = await sql`
      SELECT COUNT(*) 
        FROM groups 
        WHERE submitting_person_email = ${emailAddress}`;

    return data.rows[0].count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group data.');
  }
}

export async function fetchGroupsByNameCount(name: string) {
  noStore();

  try {
    const data = await sql`
      SELECT COUNT(*) 
        FROM groups 
        WHERE name = ${name}`;

    return data.rows[0].count;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group data.');
  }
}

export async function fetchGroupRemarks() {
  noStore();

  try {
    const data = await sql`
        SELECT 
          groups.id,
          groups.name,
          groups.submitting_person_email,
          groups.path_id,
          groups.remarks,
          paths.name AS pathName
        FROM groups
        JOIN paths ON groups.path_id = paths.id
        WHERE 
          groups.remarks != ''`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchMembersWithShirts() {
  noStore();

  try {
    const data = await sql`
        SELECT
          members.id,
          members.name,
          members.group_id,
          members.shirt_size,
          members.shirt_type,
          groups.name as group_name
        FROM members
        JOIN groups ON groups.id = members.group_id
        WHERE 
          shirt_size != '' OR shirt_type != ''`;

    return data.rows as {
      id: string;
      group_name: string;
      name: string;
      shirt_size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
      shirt_type: 'damska' | 'męska';
    }[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchMembersWithPTTKCardForPrint() {
  noStore();

  try {
    const data = await sql`
        SELECT 
          members.id as id,
          members.name as name,
          members.birthday_date as birthdaydate,
          members.pttk_card_number as pttkcardnumber
        FROM members
        WHERE pttk_card_number != ''`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchMembersWithNoPTTKCardForPrint() {
  noStore();

  try {
    const data = await sql`
        SELECT 
          members.id as id,
          members.name as name,
          members.birthday_date as birthdayDate
        FROM members
        WHERE pttk_card_number = ''`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members data.');
  }
}

export async function fetchPathsTypes() {
  noStore();

  try {
    const data = await sql<PathsTypes>`SELECT type FROM paths_types`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch paths_types data.');
  }
}

export async function fetchPaths() {
  noStore();

  try {
    const data = await sql<PathsTable>`SELECT 
     paths.id,
     paths.type,
     paths.name,
     paths.path_order,
     paths.date
    FROM paths`;

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
        paths.name,
        paths.type,
        paths.path_order
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

export async function fetchLeavingHourById(id: string) {
  noStore();

  try {
    const data = await sql<LeavingHoursTable>`
    SELECT
      id, value
    FROM leaving_hours
    WHERE id = ${id}`;

    return data.rows[0];
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
    const data = await sql<ShirtsTypesList>`SELECT type FROM shirts_types`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch paths data.');
  }
}

export async function fetchShirtsSizes() {
  noStore();

  try {
    const data = await sql<ShirtsSizesList>`SELECT size FROM shirts_sizes`;

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
        groups.id as id,
        groups.name,
        groups.leaving_hour_id,
        groups.submitting_person_email,
        groups.chef_group_phone_number,
        groups.remarks,
        groups.is_institution,
        groups.is_skkt_starachowice,
        groups.path_id as path_id,
        members.birthday_date,
        members.id as member_id,
        members.is_group_chef,
        members.is_guardian,
        members.fee,
        members.guardian_name,
        members.name as member_name,
        members.pttk_card_number,
        members.shirt_size,
        members.shirt_type,
        members.transport_id,
        members.transport_leaving_hour_id
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

export async function fetchGroupsByPathId(id: string) {
  noStore();

  try {
    const data = await sql<PathForm>`
      SELECT
        groups.id,
        groups.name,
        groups.chef_group_phone_number,
        groups.submitting_person_email,
        groups.leaving_hour_id,
        paths.id as path_id,
        leaving_hours.value as leaving_hour
      FROM groups
      JOIN paths ON groups.path_id = paths.id
      JOIN leaving_hours ON leaving_hours.id = groups.leaving_hour_id
      WHERE paths.id = ${id}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups.');
  }
}

export async function fetchMembersGroup(id: string) {
  noStore();

  try {
    const data = await sql`
      SELECT
        members.id,
        members.name,
        members.is_guardian,
        members.is_group_chef,
        members.birthday_date,
        members.guardian_name,
        members.pttk_card_number,
        members.shirt_size,
        members.shirt_type,
        members.transport_id,
        members.transport_leaving_hour_id,
        members.fee
      FROM members
      WHERE group_id = ${id}`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group data.');
  }
}

export async function fetchUsers() {
  noStore();

  try {
    const data = await sql<UsersTable>`
        SELECT
          users.id,
          users.email,
          users.name,
          users.role,
          users.group_id
        FROM users`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users data.');
  }
}

export async function fetchUserById(id: string) {
  noStore();

  try {
    const data = await sql<User>`
        SELECT
          users.id,
          users.email,
          users.name,
          users.role,
          users.group_id
        FROM users
        WHERE users.id = ${id}`;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users data.');
  }
}

export async function fetchUserByEmail(email: string) {
  noStore();

  try {
    const data = await sql<User>`
        SELECT
          users.id,
          users.email,
          users.name,
          users.role,
          users.group_id
        FROM users
        WHERE users.email = ${email}`;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users data.');
  }
}

export async function fetchOrganizers() {
  noStore();

  try {
    const data = await sql<OrganizersTable>`
        SELECT
          id,
          name,
          shirt_size,
          shirt_type
        FROM organizers`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch organizers data.');
  }
}

export async function fetchOrganizerById(id: string) {
  noStore();

  try {
    const data = await sql<OrganizersTable>`
      SELECT
        id,
        name,
        shirt_size,
        shirt_type
      FROM organizers
      WHERE organizers.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch organizer.');
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
