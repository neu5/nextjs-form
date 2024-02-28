'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const FormTransportsSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki' })
    .max(200, { message: 'Nazwa nie może mieć więcej niż 255 znaków' }),
  leavingHours: z.array(z.string()).optional(),
  date: z.string(),
});

export type TransportsState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

const CreateTransport = FormTransportsSchema.omit({ id: true, date: true });
const UpdateTransport = FormTransportsSchema.omit({ date: true });

export async function createTransport(
  prevState: TransportsState,
  formData: FormData,
) {
  // Validate form using Zod
  const validatedFields = CreateTransport.safeParse({
    name: formData.get('name'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać transportu. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { name } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO transports (name)
      VALUES (${name})
    `;
  } catch (error) {
    console.log(error);
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać transportu.',
    };
  }

  revalidatePath('/dashboard/transports');
  redirect('/dashboard/transports');
}

export async function updateTransport(
  prevState: TransportsState,
  formData: FormData,
) {
  // Validate form using Zod
  const validatedFields = UpdateTransport.safeParse({
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
      UPDATE transports
      SET name = ${name}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Transports.' };
  }

  try {
    await sql`DELETE FROM transports_leaving_hours WHERE transport_id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Transports.' };
  }

  if (leavingHours) {
    leavingHours.forEach(async (leavingHourId) => {
      try {
        await sql`
          INSERT INTO transports_leaving_hours (transport_id,leaving_hour_id) VALUES (${id},${leavingHourId});
        `;
      } catch (error) {
        return {
          message: 'Database Error: Failed to Update transports_leaving_hours.',
        };
      }
    });
  }

  revalidatePath('/dashboard/transports');
  redirect('/dashboard/transports');
}
