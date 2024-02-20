'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

const FormGroupSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'Nazwa jest wymagana' })
    .min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki' })
    .max(255, { message: 'Nazwa nie może mieć więcej niż 255 znaków' }),
  pathId: z
    .string({
      invalid_type_error: 'Wybierz trasę',
      required_error: 'Wybierz trasę',
    })
    .min(1, { message: 'Wybierz trasę' }),
  leavingHourId: z
    .string({
      invalid_type_error: 'Wybierz godzinę startu',
      required_error: 'Wybierz godzinę startu',
    })
    .min(1, { message: 'Wybierz godzinę startu' }),
  submittingPersonEmail: z
    .string()
    .max(100, { message: 'Adres email nie może mieć więcej niż 100 znaków' })
    .email({ message: 'Niepoprawny adres email' }),

  // submittingPersonPhoneNumber: z
  //   .string()
  //   .regex(/^[+0-9]*$/, {
  //     message: 'Można wpisać tylko cyfry i opcjonalnie + na początku',
  //   })
  //   .min(5, { message: 'Numer telefonu musi mieć co najmniej 5 znaków' })
  //   .max(20, { message: 'Numer telefonu nie może mieć więcej niż 20 znaków' }).optional(),

  members: z.array(z.string()).transform((val, ctx) => {
    const members = val.map((member) => JSON.parse(member));

    members.forEach((member) => {
      const name = member.name.trim();

      if (name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: JSON.stringify({
            id: member.id,
            field: 'name',
            message: 'Imię i nazwisko jest wymagane',
          }),
        });

        return z.NEVER;
      }

      if (name.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: JSON.stringify({
            id: member.id,
            field: 'name',
            message: 'Imię i nazwisko powinno być dłuższe niż 5 znaków',
          }),
        });

        return z.NEVER;
      }

      if (name.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: JSON.stringify({
            id: member.id,
            field: 'name',
            message: 'Imię i nazwisko powinno być dłuższe niż 5 znaków',
          }),
        });

        return z.NEVER;
      }

      if (member.name.length >= 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: JSON.stringify({
            id: member.id,
            field: 'name',
            message: 'Imię i nazwisko powinno być krótsze niż 20 znaków',
          }),
        });
      }
    });

    return members;
  }),
  datetime: z.string(),
});

export type GroupState = {
  errors?: {
    name?: string[];
    pathId?: string[];
    leavingHourId?: string[];
    submittingPersonEmail?: string[];
    submittingPersonPhoneNumber?: string[];
    members?: string[];
  };
  message?: string | null;
};

const CreateGroup = FormGroupSchema.omit({ id: true, datetime: true });

export async function createGroup(prevState: GroupState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateGroup.safeParse({
    name: formData.get('name'),
    pathId: formData.get('pathId'),
    leavingHourId: formData.get('leavingHourId'),
    submittingPersonEmail: formData.get('submittingPersonEmail'),
    members: formData.getAll('members'),
    // submittingPersonPhoneNumber: formData.get('submittingPersonPhoneNumber'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
    };
  }

  // Prepare data for insertion into the database
  const {
    name,
    pathId,
    leavingHourId,
    submittingPersonEmail,
    submittingPersonPhoneNumber,
    members,
  } = validatedFields.data;
  const datetime = new Date().toLocaleString('pl-PL');

  console.log({ name, members });

  return {};

  // Insert data into the database
  // try {
  //   await sql`
  //       INSERT INTO groups (
  //         name,
  //         path_id,
  //         leaving_hour_id,
  //         submitting_person_email,
  //         submitting_person_phone_number,
  //         datetime
  //       )
  //       VALUES (
  //         ${groupName},
  //         ${pathId},
  //         ${leavingHourId},
  //         ${submittingPersonEmail},
  //         ${submittingPersonPhoneNumber},
  //         ${datetime})
  //     `;
  // } catch (error) {
  //   console.log(error);
  //   // If a database error occurs, return a more specific error.
  //   return {
  //     message: 'Błąd bazy danych: nie udało się dodać grupy.',
  //   };
  // }

  // redirect('/success');
}
