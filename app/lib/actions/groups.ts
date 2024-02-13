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
  pathId: z.string({
    invalid_type_error: 'Wybierz trasę',
    required_error: 'Wybierz trasę',
  }),
  leavingHourId: z.string({
    invalid_type_error: 'Wybierz godzinę startu',
    required_error: 'Wybierz godzinę startu',
  }),
  requestingPersonEmail: z
    .string()
    .email({ message: 'Niepoprawny adres email' }),
  datetime: z.string(),
});

export type GroupState = {
  errors?: {
    groupName?: string[];
    pathId?: string[];
    requestingPersonEmail?: string[];
  };
  message?: string | null;
};

const CreateGroup = FormGroupSchema.omit({ id: true, datetime: true });

export async function createGroup(prevState: GroupState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateGroup.safeParse({
    groupName: formData.get('groupName'),
    pathId: formData.get('pathId'),
    leavingHourId: formData.get('leavingHourId'),
    requestingPersonEmail: formData.get('requestingPersonEmail'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const { groupName, pathId, leavingHourId, requestingPersonEmail } =
    validatedFields.data;
  const datetime = new Date().toLocaleString('pl-PL');

  // Insert data into the database
  try {
    await sql`
        INSERT INTO groups (name, path_id, leaving_hour_id, requesting_person_email, datetime)
        VALUES (${groupName}, ${pathId}, ${leavingHourId}, ${requestingPersonEmail}, ${datetime})
      `;
  } catch (error) {
    console.log(error);
    // If a database error occurs, return a more specific error.
    return {
      message: 'Błąd bazy danych: nie udało się dodać grupy.',
    };
  }

  redirect('/success');
}
