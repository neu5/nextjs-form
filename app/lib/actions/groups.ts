'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

const FormGroupSchema = z.object({
  id: z.string(),
  groupName: z
    .string({ required_error: 'Name is required' })
    .min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki' })
    .max(180, { message: 'Nazwa nie może mieć więcej niż 180 znaków' }),
  date: z.string(),
});

export type GroupState = {
  errors?: {
    groupName?: string[];
  };
  message?: string | null;
};

const CreateGroup = FormGroupSchema.omit({ id: true, date: true });

export async function createGroup(prevState: GroupState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateGroup.safeParse({
    groupName: formData.get('groupName'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { groupName } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
        INSERT INTO groups (name, date)
        VALUES (${groupName}, ${date})
      `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać grupy.',
    };
  }

  redirect('/success');
}
