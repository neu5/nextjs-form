'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  fetchFormConfiguration,
  fetchUserEditingConfiguration,
  fetchGroupsByEmailAddressCount,
  fetchGroupsByNameCount,
  fetchUserByEmail,
  fetchPathById,
  fetchLeavingHourById,
} from '@/app/lib/data';
import {
  birthDayValidation,
  nameValidation,
  shirtsValidation,
  minorChefGroupValidation,
} from './validation';
import { Member } from '@/app/ui/groups/group-member';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import {
  sendGroupCreateEmail,
  sendGroupCreateEmailToAdmin,
  sendGroupUpdateEmailToAdmin,
  sendGroupDeleteEmail,
  sendGroupDeleteEmailToAdmin,
} from '@/app/lib/email';
import { getSession, logout } from '@/app/lib/session';
import { isAtLeastSixteenYearsOld } from '@/app/lib/utils';

const SHIRT_FEE = 25;
const REGULAR_MEMBER_FEE = 40;
const PTTK_MEMBER_FEE = 30;
const SKKT_FEE = 20;

const getMemberFee = ({
  isInstitution,
  isGuardian,
  isSKKTStarachowice,
  PTTKCardNumber,
}: {
  isInstitution: boolean;
  isGuardian: boolean;
  isSKKTStarachowice: boolean;
  PTTKCardNumber: boolean;
}) => {
  if (isInstitution) {
    if (isGuardian) {
      return 0;
    }
    if (isSKKTStarachowice) {
      return SKKT_FEE;
    }
    if (PTTKCardNumber) {
      return PTTK_MEMBER_FEE;
    }

    return REGULAR_MEMBER_FEE;
  } else {
    return PTTKCardNumber ? PTTK_MEMBER_FEE : REGULAR_MEMBER_FEE;
  }
};

const getFee = ({
  isInstitution,
  isGuardian,
  isSKKTStarachowice,
  PTTKCardNumber,
  shirtSize,
  shirtType,
}: {
  isInstitution: boolean;
  isGuardian: boolean;
  isSKKTStarachowice: boolean;
  PTTKCardNumber: boolean;
  shirtSize: boolean;
  shirtType: boolean;
}) => {
  const memberFee = getMemberFee({
    isInstitution,
    isGuardian,
    isSKKTStarachowice,
    PTTKCardNumber,
  });

  const shirtFee = shirtSize && shirtType ? SHIRT_FEE : 0;

  return memberFee + shirtFee;
};

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
  isSKKTStarachowice: z.string().optional(),
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
      shirtsValidation({ ctx, member });
      minorChefGroupValidation({ ctx, member });
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
  shouldSentInitialEmail: z.string().optional(),
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

const CreateGroup = FormGroupSchema.omit({
  id: true,
  fee: true,
  shouldSentInitialEmail: true,
});
const UpdateGroup = FormGroupSchema.omit({
  rodo: true,
  termsAndConditions: true,
});

export async function createGroup(prevState: GroupState, formData: FormData) {
  const isFormEnabled = await fetchFormConfiguration();

  if (!isFormEnabled) {
    redirect('/form-disabled');
  }

  // Validate form using Zod
  const validatedFields = CreateGroup.safeParse({
    name: formData.get('name'),
    pathId: formData.get('pathId'),
    leavingHourId: formData.get('leavingHourId'),
    submittingPersonEmail: formData.get('submittingPersonEmail'),
    chefGroupPhoneNumber: formData.get('chefGroupPhoneNumber'),
    isInstitution: formData.get('isInstitution'),
    isSKKTStarachowice: formData.get('isSKKTStarachowice'),
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
    isSKKTStarachowice,
    members,
    remarks,
  } = validatedFields.data;
  const datetime = new Date().toLocaleString('pl-PL');

  const [groupsCountWithEmailAddress, groupsCountWithName] = await Promise.all([
    fetchGroupsByEmailAddressCount(submittingPersonEmail),
    fetchGroupsByNameCount(name),
  ]);

  if (isInstitution) {
    let nonAdultMembers = [] as Member[];
    let guardiansNumber = 0;

    for (let i = 0; i < members.length; i++) {
      if (members[i].isGuardian) {
        guardiansNumber = guardiansNumber + 1;
      }
      if (!members[i].isAdult) {
        nonAdultMembers.push(members[i]);
      }
    }

    const nonAdultMembersNum = nonAdultMembers.length;

    if (nonAdultMembersNum > 0) {
      if (guardiansNumber === 0) {
        return {
          errors: {
            name: ['Jest za mało opiekunów w grupie'],
          },
          message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
        };
      }

      const maxGuardiansNum = Math.ceil(nonAdultMembersNum / 10);

      if (guardiansNumber > maxGuardiansNum) {
        return {
          errors: {
            name: [
              `Jest zbyt wielu opiekunów. Dla grupy liczącej osób: ${nonAdultMembersNum} maksymalna liczba opiekunów to ${maxGuardiansNum}`,
            ],
          },
          message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
        };
      }
    }
  } else {
    let missingGuardiansErrors = [] as string[];

    let adultMembers = [] as Member[];
    let nonAdultMembers = [] as Member[];

    for (let i = 0; i < members.length; i++) {
      if (members[i].isAdult) {
        adultMembers.push(members[i]);
      } else {
        nonAdultMembers.push(members[i]);
      }
    }

    nonAdultMembers.forEach(({ guardianName, id }) => {
      if (guardianName === '') {
        return missingGuardiansErrors.push(id);
      }

      if (
        !adultMembers.some((adultMember) => guardianName === adultMember.name)
      ) {
        return missingGuardiansErrors.push(id);
      }
    });

    if (missingGuardiansErrors.length > 0) {
      return {
        errors: {
          members: missingGuardiansErrors.map((id) =>
            JSON.stringify({
              id,
              field: 'guardianName',
              message:
                'Dla osoby niepełnoletniej wymagane jest podanie danych opiekuna',
            }),
          ),
        },
        message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
      };
    }
  }

  if (Number(groupsCountWithEmailAddress) !== 0) {
    return {
      errors: {
        submittingPersonEmail: [
          'Jest już zgłoszona grupa połączona z tym adresem email. Proszę podać inny adres email.',
        ],
      },
      message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
    };
  }

  if (Number(groupsCountWithName) !== 0) {
    return {
      errors: {
        name: [
          'Jest już zgłoszona grupa o takiej nazwie. Podaj proszę inną nazwę grupy.',
        ],
      },
      message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
    };
  }

  const path = await fetchPathById(pathId);

  if (path.type === 'rowerowa') {
    let tooYoungMembers = [] as string[];

    members.forEach(({ birthdayDate, id, isAdult }) => {
      if (!isAdult && !isAtLeastSixteenYearsOld({ birthDate: birthdayDate })) {
        tooYoungMembers.push(id);
      }
    });

    if (tooYoungMembers.length > 0) {
      return {
        errors: {
          members: tooYoungMembers.map((id) =>
            JSON.stringify({
              id,
              field: 'birthdayDate',
              message:
                'Na trasie rowerowej uczestnik musi mieć co najmniej 16 lat rocznikowo (urodzony najpóźniej w 2008 roku)',
            }),
          ),
        },
        message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
      };
    }
  }

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
          is_skkt_starachowice,
          remarks,
          creation_datetime,
          last_edition_datetime
        )
        VALUES (
          ${name},
          ${pathId},
          ${leavingHourId},
          ${submittingPersonEmail},
          ${chefGroupPhoneNumber},
          ${isInstitution && isInstitution.length > 0 ? 'TRUE' : 'FALSE'},
          ${
            isSKKTStarachowice && isSKKTStarachowice.length > 0
              ? 'TRUE'
              : 'FALSE'
          },
          ${remarks},
          ${datetime},
          ${datetime}
        )
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
            guardianName,
            isGuardian,
            isAdult,
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
                  transport_leaving_hour_id,
                  guardian_name,
                  is_guardian,
                  is_adult,
                  fee
                )
                VALUES (
                  ${groupId},
                  ${name},
                  ${birthdayDate},
                  ${PTTKCardNumber},
                  ${chefGroupId.length > 0 ? 'TRUE' : 'FALSE'},
                  ${shirtSize},
                  ${shirtType},
                  ${transportId.length > 0 ? transportId : null},
                  ${
                    transportLeavingHourId.length > 0
                      ? transportLeavingHourId
                      : null
                  },
                  ${guardianName},
                  ${isGuardian.length > 0 ? 'TRUE' : 'FALSE'},
                  ${isAdult ? 'TRUE' : 'FALSE'},
                  ${getFee({
                    isInstitution: !!isInstitution,
                    isGuardian: !!isGuardian,
                    isSKKTStarachowice: !!isSKKTStarachowice,
                    PTTKCardNumber: !!PTTKCardNumber.length,
                    shirtSize: !!shirtSize,
                    shirtType: !!shirtType,
                  })}
                  )
              `,
        ),
      );

      const password = generator.generate({
        length: 10,
        numbers: true,
      });

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await sql`
          INSERT INTO users (email, group_id, password, role)
          VALUES (${submittingPersonEmail}, ${groupId}, ${hashedPassword}, 'user');
        `;
      } catch (error) {
        console.log(error);
        // If a database error occurs, return a more specific error.
        return {
          message: 'Błąd bazy danych: nie udało się dodać użytkownika.',
        };
      }

      const leavingHour = await fetchLeavingHourById(leavingHourId);

      try {
        await sendGroupCreateEmail({
          chefGroupPhoneNumber,
          creationTime: datetime,
          email: submittingPersonEmail,
          leavingHour: leavingHour.value,
          members,
          name,
          password,
          pathName: path.name,
          pathType: path.type,
          shirts: members.reduce((shirts, member) => {
            if (!!member.shirtType && !!member.shirtSize) {
              shirts.push({
                shirtType: member.shirtType,
                shirtSize: member.shirtSize,
              });
            }

            return shirts;
          }, []),
        });
      } catch (e) {
        throw Error(`Nie udało się wysłać maila. ${e}`);
      }

      try {
        await sendGroupCreateEmailToAdmin({
          chefGroupPhoneNumber,
          creationTime: datetime,
          email: submittingPersonEmail,
          leavingHour: leavingHour.value,
          members,
          name,
          password,
          pathName: path.name,
          pathType: path.type,
          shirts: members.reduce((shirts, member) => {
            if (!!member.shirtType && !!member.shirtSize) {
              shirts.push({
                shirtType: member.shirtType,
                shirtSize: member.shirtSize,
              });
            }

            return shirts;
          }, []),
        });
      } catch (e) {
        throw Error(`Nie udało się wysłać maila. ${e}`);
      }
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

export async function updateGroup(prevState: GroupState, formData: FormData) {
  const isEditingForUsersEnabled = await fetchUserEditingConfiguration();
  const session = await getSession();

  const isAdmin = session.user.role === 'admin';

  if (!isEditingForUsersEnabled && !isAdmin) {
    return {
      message: 'Edycja danych grupy jest wyłączona.',
    };
  }

  const validatedFields = UpdateGroup.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    pathId: formData.get('pathId'),
    leavingHourId: formData.get('leavingHourId'),
    submittingPersonEmail: formData.get('submittingPersonEmail'),
    chefGroupPhoneNumber: formData.get('chefGroupPhoneNumber'),
    isInstitution: formData.get('isInstitution'),
    isSKKTStarachowice: formData.get('isSKKTStarachowice'),
    members: formData.getAll('members'),
    remarks: formData.get('remarks'),
    shouldSentInitialEmail: formData.get('shouldSentInitialEmail'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się edytować grupy. Uzupełnij brakujące pola.',
    };
  }

  const {
    id,
    name,
    isInstitution,
    isSKKTStarachowice,
    pathId,
    leavingHourId,
    submittingPersonEmail,
    chefGroupPhoneNumber,
    members,
    remarks,
    shouldSentInitialEmail,
  } = validatedFields.data;
  const datetime = new Date().toLocaleString('pl-PL');

  if (isInstitution) {
    let nonAdultMembers = [] as Member[];
    let guardiansNumber = 0;

    for (let i = 0; i < members.length; i++) {
      if (members[i].isGuardian) {
        guardiansNumber = guardiansNumber + 1;
      }
      if (!members[i].isAdult) {
        nonAdultMembers.push(members[i]);
      }
    }

    const nonAdultMembersNum = nonAdultMembers.length;

    if (nonAdultMembersNum > 0) {
      if (guardiansNumber === 0) {
        return {
          errors: {
            name: ['Jest za mało opiekunów w grupie'],
          },
          message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
        };
      }

      const maxGuardiansNum = Math.ceil(nonAdultMembersNum / 10);

      if (guardiansNumber > maxGuardiansNum) {
        return {
          errors: {
            name: [
              `Jest zbyt wielu opiekunów. Dla grupy liczącej osób: ${members.length} maksymalna liczba opiekunów to ${maxGuardiansNum}`,
            ],
          },
          message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
        };
      }
    }
  } else {
    let missingGuardiansErrors = [] as string[];

    let adultMembers = [] as Member[];
    let nonAdultMembers = [] as Member[];

    for (let i = 0; i < members.length; i++) {
      if (members[i].isAdult) {
        adultMembers.push(members[i]);
      } else {
        nonAdultMembers.push(members[i]);
      }
    }

    nonAdultMembers.forEach(({ guardianName, id }) => {
      if (guardianName === '') {
        return missingGuardiansErrors.push(id);
      }

      if (
        !adultMembers.some((adultMember) => guardianName === adultMember.name)
      ) {
        return missingGuardiansErrors.push(id);
      }
    });

    if (missingGuardiansErrors.length > 0) {
      return {
        errors: {
          members: missingGuardiansErrors.map((id) =>
            JSON.stringify({
              id,
              field: 'guardianName',
              message:
                'Dla osoby niepełnoletniej wymagane jest podanie danych opiekuna',
            }),
          ),
        },
        message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
      };
    }
  }

  const path = await fetchPathById(pathId);

  if (path.type === 'rowerowa') {
    let tooYoungMembers = [] as string[];

    members.forEach(({ birthdayDate, id, isAdult }) => {
      if (!isAdult && !isAtLeastSixteenYearsOld({ birthDate: birthdayDate })) {
        tooYoungMembers.push(id);
      }
    });

    if (tooYoungMembers.length > 0) {
      return {
        errors: {
          members: tooYoungMembers.map((id) =>
            JSON.stringify({
              id,
              field: 'birthdayDate',
              message:
                'Na trasie rowerowej uczestnik musi mieć co najmniej 16 lat rocznikowo (urodzony najpóźniej w 2008 roku)',
            }),
          ),
        },
        message: 'Nie udało się dodać grupy. Uzupełnij brakujące pola.',
      };
    }
  }

  try {
    await sql`
      UPDATE groups
      SET 
        name = ${name},
        path_id = ${pathId},
        leaving_hour_id = ${leavingHourId},
        submitting_person_email = ${submittingPersonEmail},
        chef_group_phone_number = ${chefGroupPhoneNumber},
        is_institution = ${
          isInstitution && isInstitution.length > 0 ? 'TRUE' : 'FALSE'
        },
        remarks = ${remarks},
        last_edition_datetime = ${datetime}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Group.' };
  }

  try {
    await sql`DELETE FROM members WHERE group_id = ${id}`;

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
            fee,
            transportLeavingHourId,
            guardianName,
            isGuardian,
            isAdult,
          }: Member) => sql`
                INSERT INTO members (
                  group_id,
                  name,
                  birthday_date,
                  pttk_card_number,
                  is_group_chef,
                  shirt_size,
                  shirt_type,
                  transport_id,
                  transport_leaving_hour_id,
                  guardian_name,
                  is_guardian,
                  is_adult,
                  fee
                )
                VALUES (
                  ${id},
                  ${name},
                  ${birthdayDate},
                  ${PTTKCardNumber},
                  ${chefGroupId && chefGroupId.length > 0 ? 'TRUE' : 'FALSE'},
                  ${shirtSize},
                  ${shirtType},
                  ${transportId && transportId.length > 0 ? transportId : null},
                  ${
                    transportLeavingHourId && transportLeavingHourId.length > 0
                      ? transportLeavingHourId
                      : null
                  },
                  ${guardianName},
                  ${isGuardian && isGuardian.length > 0 ? 'TRUE' : 'FALSE'},
                  ${isAdult ? 'TRUE' : 'FALSE'},
                  ${
                    isAdmin
                      ? fee
                      : getFee({
                          isInstitution: !!isInstitution,
                          isGuardian: !!isGuardian,
                          isSKKTStarachowice: !!isSKKTStarachowice,
                          PTTKCardNumber: !!PTTKCardNumber.length,
                          shirtSize: !!shirtSize,
                          shirtType: !!shirtType,
                        })
                  }
                  )
              `,
        ),
      );

      if (shouldSentInitialEmail === 'true') {
        const password = generator.generate({
          length: 10,
          numbers: true,
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
          await sql`
            UPDATE users
            SET               
              password = ${hashedPassword}
            WHERE email = ${submittingPersonEmail}
          `;
        } catch (error) {
          return { message: 'Database Error: Failed to Update Users.' };
        }

        const leavingHour = await fetchLeavingHourById(leavingHourId);

        try {
          await sendGroupCreateEmail({
            chefGroupPhoneNumber,
            creationTime: datetime,
            email: submittingPersonEmail,
            leavingHour: leavingHour.value,
            members,
            name,
            password,
            pathName: path.name,
            pathType: path.type,
            shirts: members.reduce((shirts, member) => {
              if (!!member.shirtType && !!member.shirtSize) {
                shirts.push({
                  shirtType: member.shirtType,
                  shirtSize: member.shirtSize,
                });
              }

              return shirts;
            }, []),
          });
        } catch (e) {
          throw Error(`Nie udało się wysłać maila. ${e}`);
        }
      }

      await sendGroupUpdateEmailToAdmin({ name });
    } catch (error) {
      console.log(error);

      return {
        message: 'Błąd bazy danych: nie udało się edytować uczestników grupy.',
      };
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Members.' };
  }

  revalidatePath('/dashboard/groups');
  redirect('/dashboard/groups');
}

export async function deleteGroup({
  id,
  name,
  submitting_person_email,
}: {
  id: string;
  name: string;
  submitting_person_email: string;
}) {
  const user = await fetchUserByEmail(submitting_person_email);

  if (!user) {
    return { message: 'Database Error: Failed to fetch the User.' };
  }

  const session = await getSession();
  const isAdmin = session.user.role === 'admin';

  // delete members
  try {
    await sql`DELETE FROM members WHERE group_id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Members.' };
  }

  // delete group
  try {
    await sql`DELETE FROM groups WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Organizer.' };
  }

  // delete user
  try {
    await sql`DELETE FROM users WHERE id = ${user.id}`;

    if (!isAdmin) {
      await logout();
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete User.' };
  }

  sendGroupDeleteEmail({ name, email: submitting_person_email });
  sendGroupDeleteEmailToAdmin({ name });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
