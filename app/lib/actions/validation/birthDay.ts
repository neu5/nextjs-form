'use server';

import { z } from 'zod';

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
};
