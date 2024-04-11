'use server';

import { z } from 'zod';
import { isAtLeastTenYearsOld } from '@/app/lib/utils';

export const birthDayValidation = ({
  ctx,
  member,
}: {
  ctx: z.RefinementCtx;
  member: {
    birthdayDate: string;
    id: string;
  };
}) => {
  if (member.birthdayDate.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: JSON.stringify({
        id: member.id,
        field: 'birthdayDate',
        message: 'Data urodzenia jest wymagana',
      }),
    });
  }

  if (!isAtLeastTenYearsOld({ birthDate: member.birthdayDate })) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: JSON.stringify({
        id: member.id,
        field: 'birthdayDate',
        message:
          'Uczestnik musi mieć co najmniej 10 lat rocznikowo (urodzony najpóźniej w 2014 roku)',
      }),
    });
  }
};
