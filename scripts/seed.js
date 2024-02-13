const { db } = require('@vercel/postgres');
const { leavingHours, users } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedPaths(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS paths (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
          datetime VARCHAR(20) NOT NULL
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

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedPaths(client);
  await seedLeavingHours(client);
  await seedLeavingHoursToPaths(client);

  await seedGroups(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
