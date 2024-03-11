'use server';

import { z } from 'zod';

export const nameValidation = ({
  ctx,
  member,
}: {
  ctx: z.RefinementCtx;
  member: {
    name: string;
    id: string;
  };
}) => {
  let hasNameError = false;
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

    hasNameError = true;
  }

  if (name.length < 3 && !hasNameError) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: JSON.stringify({
        id: member.id,
        field: 'name',
        message: 'Imię i nazwisko powinno być dłuższe niż 3 znaki',
      }),
    });

    hasNameError = true;
  }

  if (member.name.length >= 200 && !hasNameError) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: JSON.stringify({
        id: member.id,
        field: 'name',
        message: 'Imię i nazwisko powinno być krótsze niż 200 znaków',
      }),
    });
  }
};
