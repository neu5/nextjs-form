'use server';

import { z } from 'zod';

export const shirtsValidation = ({
  ctx,
  member,
}: {
  ctx: z.RefinementCtx;
  member: {
    shirtType: string;
    shirtSize: string;
    id: string;
  };
}) => {
  if (
    (member.shirtSize.length !== 0 && member.shirtType.length === 0) ||
    (member.shirtSize.length === 0 && member.shirtType.length !== 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: JSON.stringify({
        id: member.id,
        field: 'shirtSize',
        message: 'Należy wybrać typ i rozmiar koszulki',
      }),
    });
  }
};
