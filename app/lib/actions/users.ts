'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import { sendCreateUserEmail } from '@/app/lib/email';

const FormUsersSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'Name is required' })
    .max(200, { message: 'Nazwa nie może mieć więcej niż 200 znaków' })
    .optional(),
  email: z.string(),
  role: z.enum(['admin', 'user']),
  password: z
    .string()
    .max(50, { message: 'Hasło nie może mieć więcej niż 50 znaków' })
    .optional(),
  passwordConfirmation: z
    .string()
    .max(50, { message: 'Hasło nie może mieć więcej niż 50 znaków' })
    .optional(),
});

export type UsersState = {
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
  message?: string | null;
};

const CreateUser = FormUsersSchema.omit({
  id: true,
  password: true,
  passwordConfirmation: true,
});

const UpdateUser = FormUsersSchema.refine(
  (data) => data.password === data.passwordConfirmation,
  {
    message: 'Hasła nie są takie same',
    path: ['passwordConfirmation'],
  },
);

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
      message: 'Błąd bazy danych: nie udało się dodać użytkownika.',
    };
  }

  sendCreateUserEmail({ email, password });

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function updateUser(prevState: UsersState, formData: FormData) {
  const validatedFields = UpdateUser.safeParse({
    id: formData.get('id'),
    email: formData.get('email'),
    name: formData.get('name'),
    role: formData.get('role'),
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się edytować użytkownika. Uzupełnij brakujące pola.',
    };
  }

  const { id, name, role, password } = validatedFields.data;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await sql`
        UPDATE users
        SET 
          name = ${name},
          role = ${role},
          password = ${hashedPassword}
        WHERE id = ${id}
      `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Users.' };
    }
  } else {
    try {
      await sql`
        UPDATE users
        SET 
          name = ${name},
          role = ${role}
        WHERE id = ${id}
      `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Users.' };
    }
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/users');
    return { message: 'Deleted User.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete User.' };
  }
}
