'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { birthDayValidation, nameValidation } from './validation';

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
  chefGroupPhoneNumber: z
    .string()
    .regex(/^[+0-9]*$/, {
      message: 'Można wpisać tylko cyfry i opcjonalnie + na początku',
    })
    .min(5, { message: 'Numer telefonu musi mieć co najmniej 5 znaków' })
    .max(20, { message: 'Numer telefonu nie może mieć więcej niż 20 znaków' }),
  isInstitution: z.string().optional(),
  remarks: z
    .string()
    .max(1000, { message: 'Uwagi nie mogą być dłuższe niż 1000 znaków' }),
  termsAndConditions: z
    .string()
    .min(4, { message: 'Akceptacja regulaminu jest wymagana' }),
  rodo: z.string().min(4, { message: 'Akceptacja jest wymagana' }),
  members: z.array(z.string()).transform((val, ctx) => {
    const members = val.map((member) => JSON.parse(member));

    members.forEach((member) => {
      nameValidation({ ctx, member });
      birthDayValidation({ ctx, member });
    });

    const showMissingChefError = !members.some(
      (member) => member.chefGroupId.length > 0,
    );

    if (showMissingChefError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: JSON.stringify({
          field: 'chefGroupId',
          message: 'Kierownik grupy nie został wybrany',
        }),
      });
    }

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
    chefGroupPhoneNumber?: string[];
    members?: string[];
    remarks?: string[];
    termsAndConditions?: string[];
    rodo?: string[];
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
    chefGroupPhoneNumber: formData.get('chefGroupPhoneNumber'),
    isInstitution: formData.get('isInstitution'),
    members: formData.getAll('members'),
    remarks: formData.get('remarks'),
    termsAndConditions: formData.get('termsAndConditions'),
    rodo: formData.get('rodo'),
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
    chefGroupPhoneNumber,
    isInstitution,
    members,
    remarks,
  } = validatedFields.data;
  const datetime = new Date().toLocaleString('pl-PL');

  // Insert data into the database
  try {
    const group = await sql`
        INSERT INTO groups (
          name,
          path_id,
          leaving_hour_id,
          submitting_person_email,
          chef_group_phone_number,
          is_institution,
          remarks,
          datetime
        )
        VALUES (
          ${name},
          ${pathId},
          ${leavingHourId},
          ${submittingPersonEmail},
          ${chefGroupPhoneNumber},
          ${isInstitution && isInstitution.length > 0 ? 'TRUE' : 'FALSE'},
          ${remarks},
          ${datetime})
        RETURNING id
      `;

    const groupId = group.rows[0].id;

    try {
      await Promise.all(
        members.map(
          ({
            name,
            birthdayDate,
            PTTKCardNumber,
            chefGroupId,
            shirtType,
            shirtSize,
            transportId,
            transportLeavingHourId,
          }) => sql`
                INSERT INTO members (
                  group_id,
                  name,
                  birthday_date,
                  pttk_card_number,
                  is_group_chef,
                  shirt_size,
                  shirt_type,
                  transport_id,
                  transport_leaving_hour_id
                )
                VALUES (
                  ${groupId},
                  ${name},
                  ${birthdayDate},
                  ${PTTKCardNumber},
                  ${chefGroupId.length > 0 ? 'TRUE' : 'FALSE'},
                  ${shirtSize},
                  ${shirtType},
                  ${transportId},
                  ${transportLeavingHourId}
                  )
              `,
        ),
      );
    } catch (error) {
      console.log(error);

      return {
        message: 'Błąd bazy danych: nie udało się dodać uczestników do grupy.',
      };
    }
  } catch (error) {
    console.log(error);

    return {
      message: 'Błąd bazy danych: nie udało się dodać grupy.',
    };
  }

  redirect('/success');
}
