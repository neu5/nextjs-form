import type { PathsTable } from '@/app/lib/definitions';

const TRIP_STARTING_DATE = new Date('2025-06-07');
const THE_YOUNGEST_MEMBER_BIRTHDAY_DATE = new Date('2015-12-31');
const THE_YOUNGEST_MEMBER_BICYCLE_PATH_BIRTHDAY_DATE = new Date('2009-12-31');

export const IS_TRANSPORTATION_ENABLED: boolean = true;

export const isAtLeastTenYearsOld = ({
  date = THE_YOUNGEST_MEMBER_BIRTHDAY_DATE,
  birthDate,
}: {
  date?: Date;
  birthDate: string;
}) =>
  /* @ts-ignore */
  Math.floor((date - new Date(birthDate).getTime()) / 3.15576e10) >= 0;

export const isAtLeastSixteenYearsOld = ({
  date = THE_YOUNGEST_MEMBER_BICYCLE_PATH_BIRTHDAY_DATE,
  birthDate,
}: {
  date?: Date;
  birthDate: string;
}) =>
  /* @ts-ignore */
  Math.floor((date - new Date(birthDate).getTime()) / 3.15576e10) >= 0;

export const isAdult = ({
  eventDate = TRIP_STARTING_DATE,
  birthDate,
}: {
  birthDate: string;
  eventDate?: Date;
}) =>
  /* @ts-ignore */
  Math.floor((eventDate - new Date(birthDate).getTime()) / 3.15576e10) >= 18;

export const getSortedMembersShirts = (
  membersWithShirts: {
    shirt_size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    shirt_type: 'damska' | 'męska';
  }[],
) =>
  membersWithShirts.reduce(
    (shirts, shirtInfo) => ({
      ...shirts,
      ...(shirtInfo.shirt_type === 'męska'
        ? {
            male: {
              ...shirts.male,
              [shirtInfo.shirt_size]: shirts.male[shirtInfo.shirt_size] + 1,
            },
          }
        : {}),
      ...(shirtInfo.shirt_type === 'damska'
        ? {
            female: {
              ...shirts.female,
              [shirtInfo.shirt_size]: shirts.female[shirtInfo.shirt_size] + 1,
            },
          }
        : {}),
    }),
    {
      male: {
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
      },
      female: {
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
      },
    },
  );

export const getSortedPaths = (paths: PathsTable[]) =>
  paths.sort(
    (a: { path_order?: string }, b: { path_order?: string }) =>
      Number(a.path_order === '' ? Infinity : a.path_order) -
      Number(b.path_order === '' ? Infinity : b.path_order),
  );

export const getSortedLeavingHours = (
  leavingHours: { id: string; value: string }[],
) =>
  leavingHours?.sort(
    (a: { value: string }, b: { value: string }) =>
      Number(a.value.replace(':', '')) - Number(b.value.replace(':', '')),
  );

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'pl-PL',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
