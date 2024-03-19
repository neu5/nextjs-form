'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import generator from 'generate-password';
import bcrypt from 'bcrypt';

const FormUsersSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'Name is required' })
    .max(200, { message: 'Nazwa nie może mieć więcej niż 255 znaków' })
    .optional(),
  email: z.string(),
  role: z.enum(['admin', 'user']),
});

export type UsersState = {
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
  };
  message?: string | null;
};

const CreateUser = FormUsersSchema.omit({ id: true });
// const UpdateOrganizer = FormOrganizersSchema;

export async function createUser(prevState: UsersState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać użytkownika. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { name, email, role } = validatedFields.data;

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  console.log(password);

  // Insert data into the database
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (email, name, password, role)
      VALUES (${email}, ${name}, ${hashedPassword}, ${role});
    `;
  } catch (error) {
    console.log(error);
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać organizatora.',
    };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

// export async function updateOrganizer(
//   prevState: OrganizersState,
//   formData: FormData,
// ) {
//   const validatedFields = UpdateOrganizer.safeParse({
//     id: formData.get('id'),
//     name: formData.get('name'),
//     shirtSize: formData.get('shirtSize'),
//     shirtType: formData.get('shirtType'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Nie udało się edytować organizatora. Uzupełnij brakujące pola.',
//     };
//   }

//   const { id, name, shirtSize, shirtType } = validatedFields.data;

//   try {
//     await sql`
//       UPDATE organizers
//       SET name = ${name}, shirt_size = ${shirtSize}, shirt_type = ${shirtType}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return { message: 'Database Error: Failed to Update Organizers.' };
//   }

//   revalidatePath('/dashboard/organizers');
//   redirect('/dashboard/organizers');
// }

// export async function deleteOrganizer(id: string) {
//   try {
//     await sql`DELETE FROM organizers WHERE id = ${id}`;
//     revalidatePath('/dashboard/organizers');
//     return { message: 'Deleted Organizer.' };
//   } catch (error) {
//     return { message: 'Database Error: Failed to Delete Organizer.' };
//   }
// }
