'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const FormConfigurationSchema = z.object({
  isFormEnabled: z.string().nullable(),
  isEditingForUsersEnabled: z.string().nullable(),
  isMailingEnabled: z.string().nullable(),
});

export type ConfigurationState = {
  errors?: {
    isFormEnabled?: string[];
    isEditingForUsersEnabled?: string[];
    isMailingEnabled?: string[];
  };
  message?: string | null;
};

const UpdateConfiguration = FormConfigurationSchema;

export async function updateConfiguration(
  prevState: ConfigurationState,
  formData: FormData,
) {
  const validatedFields = UpdateConfiguration.safeParse({
    isFormEnabled: formData.get('isFormEnabled'),
    isEditingForUsersEnabled: formData.get('isEditingForUsersEnabled'),
    isMailingEnabled: formData.get('isMailingEnabled'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Nie udało się edytować ustawień.',
    };
  }

  const { isFormEnabled, isEditingForUsersEnabled, isMailingEnabled } =
    validatedFields.data;

  try {
    await sql`
      UPDATE configuration
      SET 
        is_form_enabled = ${!!isFormEnabled},
        is_editing_for_users_enabled = ${!!isEditingForUsersEnabled},
        is_mailing_enabled = ${!!isMailingEnabled}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Configuration.' };
  }

  revalidatePath('/dashboard/configuration');
  redirect('/dashboard/configuration');
}
