'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const FormOrganizersSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki' })
    .max(200, { message: 'Nazwa nie może mieć więcej niż 255 znaków' }),
  shirtSize: z.string().optional(),
  shirtType: z.string().optional(),
});

export type OrganizersState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

const CreateOrganizer = FormOrganizersSchema.omit({ id: true });
const UpdateOrganizer = FormOrganizersSchema;

export async function createOrganizer(
  prevState: OrganizersState,
  formData: FormData,
) {
  // Validate form using Zod
  const validatedFields = CreateOrganizer.safeParse({
    name: formData.get('name'),
    shirtSize: formData.get('shirtSize'),
    shirtType: formData.get('shirtType'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać organizatora. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { name, shirtSize, shirtType } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO organizers (name, shirt_size, shirt_type)
      VALUES (${name}, ${shirtSize}, ${shirtType})
    `;
  } catch (error) {
    console.log(error);
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać organizatora.',
    };
  }

  revalidatePath('/dashboard/organizers');
  redirect('/dashboard/organizers');
}

export async function updateOrganizer(
  prevState: OrganizersState,
  formData: FormData,
) {
  const validatedFields = UpdateOrganizer.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    shirtSize: formData.get('shirtSize'),
    shirtType: formData.get('shirtType'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się edytować organizatora. Uzupełnij brakujące pola.',
    };
  }

  const { id, name, shirtSize, shirtType } = validatedFields.data;

  try {
    await sql`
      UPDATE organizers
      SET name = ${name}, shirt_size = ${shirtSize}, shirt_type = ${shirtType}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Organizers.' };
  }

  revalidatePath('/dashboard/organizers');
  redirect('/dashboard/organizers');
}

export async function deleteOrganizer(id: string) {
  try {
    await sql`DELETE FROM organizers WHERE id = ${id}`;
    revalidatePath('/dashboard/organizers');
    return { message: 'Deleted Organizer.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Organizer.' };
  }
}
