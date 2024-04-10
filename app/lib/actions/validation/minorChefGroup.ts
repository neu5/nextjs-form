'use server';

import { z } from 'zod';

export const minorChefGroupValidation = ({
  ctx,
  member,
}: {
  ctx: z.RefinementCtx;
  member: {
    isAdult: boolean;
    chefGroupId: string;
    id: string;
  };
}) => {
  if (!member.isAdult && member.chefGroupId.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: JSON.stringify({
        id: member.id,
        field: 'name',
        message: 'Niepełnoletni uczestnik nie może być kierownikiem',
      }),
    });
  }
};
