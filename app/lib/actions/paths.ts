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
  date: z.string(),
});

export type PathState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

const CreatePath = FormPathsSchema.omit({ id: true, date: true });

export async function createPath(prevState: PathState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreatePath.safeParse({
    name: formData.get('name'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
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
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać trasy.',
    };
  }

  revalidatePath('/dashboard/paths');
  redirect('/dashboard/paths');
}
