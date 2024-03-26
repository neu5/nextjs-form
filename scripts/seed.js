const { db } = require('@vercel/postgres');
const {
  configuration,
  leavingHours,
  pathsTypes,
  shirtsTypes,
  shirtsSizes,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedConfiguration(client) {
  try {
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS configuration (
          is_form_enabled BOOLEAN DEFAULT FALSE,
          is_editing_for_users_enabled BOOLEAN DEFAULT FALSE,
          is_mailing_enabled BOOLEAN DEFAULT FALSE
        );
      `;

    console.log(`Created "configuration" table`);

    const insertedConfig = await Promise.all(
      configuration.map(
        ({
          is_form_enabled,
          is_editing_for_users_enabled,
          is_mailing_enabled,
        }) => client.sql`
          INSERT INTO configuration (is_form_enabled, is_editing_for_users_enabled, is_mailing_enabled)
          VALUES (${is_form_enabled}, ${is_editing_for_users_enabled}, ${is_mailing_enabled});
        `,
      ),
    );

    console.log(`Seeded ${insertedConfig.length} configuration`);

    return {
      createTable,
      insertedConfig,
    };
  } catch (error) {
    console.error('Error seeding configuration:', error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(20) NOT NULL,
        group_id UUID
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async ({ email, name, password, role }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        return client.sql`
        INSERT INTO users (email, name, password, role)
        VALUES (${email}, ${name}, ${hashedPassword}, ${role});
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      // users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedPathsTypes(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS paths_types (
          type VARCHAR(50) NOT NULL
        );
      `;

    console.log(`Created "paths_types" table`);

    const insertedPathsTypes = await Promise.all(
      pathsTypes.map(
        (pathType) => client.sql`
          INSERT INTO paths_types (type)
          VALUES (${pathType});
        `,
      ),
    );

    console.log(`Seeded ${insertedPathsTypes.length} paths_types`);

    return {
      createTable,
      insertedPathsTypes,
    };
  } catch (error) {
    console.error('Error seeding paths_types:', error);
    throw error;
  }
}

async function seedPaths(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS paths (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          type VARCHAR(50),
          name VARCHAR(255) NOT NULL,
          date DATE NOT NULL
        );
      `;

    console.log(`Created "paths" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding paths:', error);
    throw error;
  }
}

async function seedLeavingHours(client) {
  try {
    // await client.sql`DROP TABLE IF EXISTS leaving_hours`;

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS leaving_hours (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          value VARCHAR(255) NOT NULL,
          is_deleted BOOLEAN DEFAULT FALSE
        );
      `;

    console.log(`Created "leaving_hours" table`);

    const insertedLeavingHours = await Promise.all(
      leavingHours.map(
        (leavingHour) => client.sql`
          INSERT INTO leaving_hours (value)
          VALUES (${leavingHour.value})
        `,
      ),
    );

    console.log(`Seeded ${insertedLeavingHours.length} leaving hours`);

    return {
      createTable,
      leavingHours: insertedLeavingHours,
    };
  } catch (error) {
    console.error('Error seeding leaving_hours:', error);
    throw error;
  }
}

async function seedLeavingHoursToPaths(client) {
  try {
    // await client.sql`DROP TABLE IF EXISTS paths_leaving_hours`;

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS paths_leaving_hours (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        path_id UUID NOT NULL,
        leaving_hour_id UUID NOT NULL
      );
    `;

    console.log(`Created "paths_leaving_hours" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding paths:', error);
    throw error;
  }
}

async function seedGroups(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS groups (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          path_id UUID NOT NULL,
          leaving_hour_id UUID NOT NULL,
          submitting_person_email VARCHAR(100) NOT NULL,
          chef_group_phone_number VARCHAR(20) NOT NULL,
          is_institution BOOLEAN DEFAULT FALSE,
          remarks VARCHAR(1000),
          creation_datetime VARCHAR(20) NOT NULL,
          last_edition_datetime VARCHAR(20) NOT NULL
        );
      `;

    console.log(`Created "groups" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding groups:', error);
    throw error;
  }
}

async function seedMembers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS members (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          group_id UUID NOT NULL,
          shirt_size VARCHAR(5),
          shirt_type VARCHAR(20),
          transport_id UUID,
          transport_leaving_hour_id UUID,
          name VARCHAR(255) NOT NULL,
          birthday_date VARCHAR(12) NOT NULL,
          pttk_card_number VARCHAR(6),
          guardian_name VARCHAR(255),
          is_adult BOOLEAN DEFAULT FALSE,
          is_group_chef BOOLEAN DEFAULT FALSE,
          is_guardian BOOLEAN DEFAULT FALSE
        );
      `;

    console.log(`Created "members" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding members:', error);
    throw error;
  }
}

async function seedShirtTypes(client) {
  try {
    // await client.sql`DROP TABLE IF EXISTS shirts_types`;

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS shirts_types (
          type VARCHAR(20) NOT NULL
        );
      `;

    console.log(`Created "shirts_types" table`);

    const insertedShirtTypes = await Promise.all(
      shirtsTypes.map(
        (shirtType) => client.sql`
          INSERT INTO shirts_types (type)
          VALUES (${shirtType});
        `,
      ),
    );

    console.log(`Seeded ${insertedShirtTypes.length} shirts types`);

    return {
      createTable,
      insertedShirtTypes,
    };
  } catch (error) {
    console.error('Error seeding shirts_types:', error);
    throw error;
  }
}

async function seedShirtSizes(client) {
  try {
    // await client.sql`DROP TABLE IF EXISTS shirts_sizes`;

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS shirts_sizes (
          size VARCHAR(5) NOT NULL
        );
      `;

    console.log(`Created "shirts_sizes" table`);

    const insertedShirtSizes = await Promise.all(
      shirtsSizes.map(
        (shirtSize) => client.sql`
          INSERT INTO shirts_sizes (size)
          VALUES (${shirtSize});
        `,
      ),
    );

    console.log(`Seeded ${insertedShirtSizes.length} shirts sizes`);

    return {
      createTable,
      insertedShirtSizes,
    };
  } catch (error) {
    console.error('Error seeding shirts_sizes:', error);
    throw error;
  }
}

async function seedTransports(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS transports (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(200) NOT NULL
        );
      `;

    console.log(`Created "transports" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding transports:', error);
    throw error;
  }
}

async function seedLeavingHoursToTransports(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS transports_leaving_hours (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        transport_id UUID NOT NULL,
        leaving_hour_id UUID NOT NULL
      );
    `;

    console.log(`Created "transports_leaving_hours" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding transports_leaving_hours:', error);
    throw error;
  }
}

async function seedOrganizers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS organizers (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          shirt_size VARCHAR(5),
          shirt_type VARCHAR(20)
        );
      `;

    console.log(`Created "organizers" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding organizers:', error);
    throw error;
  }
}

async function dropTables(client) {
  try {
    const createTable = await client.sql`
      DROP TABLE IF EXISTS paths_types;
      DROP TABLE IF EXISTS paths;
      DROP TABLE IF EXISTS leaving_hours;
      DROP TABLE IF EXISTS paths_leaving_hours;
      DROP TABLE IF EXISTS groups;
      DROP TABLE IF EXISTS members;
      DROP TABLE IF EXISTS shirts_types;
      DROP TABLE IF EXISTS shirts_sizes;
      DROP TABLE IF EXISTS transports;
      DROP TABLE IF EXISTS transports_leaving_hours;
      DROP TABLE IF EXISTS organizers;
    `;

    console.log(`Dropped tables`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error dropping tables', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  // await dropTables(client);

  // await seedConfiguration(client);

  // await seedUsers(client);
  // await seedPathsTypes(client);
  // await seedPaths(client);
  // await seedLeavingHours(client);
  // await seedLeavingHoursToPaths(client);
  // await seedShirtTypes(client);
  // await seedShirtSizes(client);
  // await seedTransports(client);
  // await seedLeavingHoursToTransports(client);
  // await seedOrganizers(client);

  // await seedGroups(client);
  // await seedMembers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
