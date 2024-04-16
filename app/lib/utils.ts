const TRIP_STARTING_DATE = new Date('2024-05-25');
const THE_YOUNGEST_MEMBER_BIRTHDAY_DATE = new Date('2014-12-31');

export const isAtLeastTenYearsOld = ({
  date = THE_YOUNGEST_MEMBER_BIRTHDAY_DATE,
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

export const getSortedLeavingHours = (
  leavingHours: { id: string; value: string }[],
) =>
  leavingHours?.sort(
    (a: { value: string }, b: { value: string }) =>
      Number(a.value.replace(':', '')) - Number(b.value.replace(':', '')),
  );

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

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

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
