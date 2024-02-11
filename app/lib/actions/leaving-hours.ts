'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const FormLeavingHourSchema = z.object({
  id: z.string(),
  value: z
    .string({ required_error: 'Value is required' })
    .length(5, { message: 'Godzina startu powinna mieć format: HH:MM' }),
});

export type LeaivngHourState = {
  errors?: {
    value?: string[];
  };
  message?: string | null;
};

const CreateLeavingHour = FormLeavingHourSchema.omit({ id: true });

export async function createLeavingHour(
  prevState: LeaivngHourState,
  formData: FormData,
) {
  // Validate form using Zod
  const validatedFields = CreateLeavingHour.safeParse({
    value: formData.get('value'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać godziny startu. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { value } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO leaving_hours (value)
      VALUES (${value})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać trasy.',
    };
  }

  revalidatePath('/dashboard/leaving-hours');
  redirect('/dashboard/leaving-hours');
}
