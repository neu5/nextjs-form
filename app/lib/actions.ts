'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Błędne dane.';
        default:
          return 'Coś poszło nie tak.';
      }
    }
    throw error;
  }
}

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

  console.log('add to the database...');

  // Insert data into the database
  // try {
  //   await sql`
  //     INSERT INTO invoices (customer_id, amount, status, date)
  //     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  //   `;
  // } catch (error) {
  //   // If a database error occurs, return a more specific error.
  //   return {
  //     message: 'Database Error: Failed to Create Invoice.',
  //   };
  // }

  // Revalidate the cache for the invoices page and redirect the user.

  redirect('/success');
}
