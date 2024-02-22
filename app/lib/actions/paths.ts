'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const FormPathsSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki' })
    .max(255, { message: 'Nazwa nie może mieć więcej niż 255 znaków' }),
  leavingHours: z.array(z.string()).optional(),
  date: z.string(),
});

export type PathState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

const CreatePath = FormPathsSchema.omit({ id: true, date: true });
const UpdatePath = FormPathsSchema.omit({ date: true });

export async function createPath(prevState: PathState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreatePath.safeParse({
    name: formData.get('name'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać trasy. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { name } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO paths (name, date)
      VALUES (${name}, ${date})
    `;
  } catch (error) {
    console.log(error);
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać trasy.',
    };
  }

  revalidatePath('/dashboard/paths');
  redirect('/dashboard/paths');
}

export async function updatePath(prevState: PathState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = UpdatePath.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    leavingHours: formData.getAll('leavingHours'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się edytować trasy. Uzupełnij brakujące pola.',
    };
  }

  const { id, name, leavingHours } = validatedFields.data;

  try {
    await sql`
      UPDATE paths
      SET name = ${name}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Paths.' };
  }

  try {
    await sql`DELETE FROM paths_leaving_hours WHERE path_id = ${id}`;
  } catch (error) {}

  leavingHours.forEach(async (leavingHourId) => {
    try {
      await sql`
        INSERT INTO paths_leaving_hours (path_id,leaving_hour_id) VALUES (${id},${leavingHourId});
      `;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Update paths_leaving_hours.',
      };
    }
  });

  revalidatePath('/dashboard/paths');
  redirect('/dashboard/paths');
}
