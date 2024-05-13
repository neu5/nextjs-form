import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import { fetchMembersWithShirts, fetchOrganizers } from '@/app/lib/data';
import { Metadata } from 'next';
import { getSortedMembersShirts } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: 'Koszulki',
};

type sortedShirts = {
  male: shirts;
  female: shirts;
};
type shirts = { S: number; M: number; L: number; XL: number; XXL: number };

const getSortedShirts = (
  sortedMembersShirts: sortedShirts,
  sortedOrganizersShirts: sortedShirts,
) => ({
  male: {
    S: sortedMembersShirts.male.S + sortedOrganizersShirts.male.S,
    M: sortedMembersShirts.male.M + sortedOrganizersShirts.male.M,
    L: sortedMembersShirts.male.L + sortedOrganizersShirts.male.L,
    XL: sortedMembersShirts.male.XL + sortedOrganizersShirts.male.XL,
    XXL: sortedMembersShirts.male.XXL + sortedOrganizersShirts.male.XXL,
  },
  female: {
    S: sortedMembersShirts.female.S + sortedOrganizersShirts.female.S,
    M: sortedMembersShirts.female.M + sortedOrganizersShirts.female.M,
    L: sortedMembersShirts.female.L + sortedOrganizersShirts.female.L,
    XL: sortedMembersShirts.female.XL + sortedOrganizersShirts.female.XL,
    XXL: sortedMembersShirts.female.XXL + sortedOrganizersShirts.female.XXL,
  },
});

const getShirtsSum = (sortedShirts: sortedShirts) =>
  sortedShirts.male.S +
  sortedShirts.male.M +
  sortedShirts.male.L +
  sortedShirts.male.XL +
  sortedShirts.male.XXL +
  sortedShirts.female.S +
  sortedShirts.female.M +
  sortedShirts.female.L +
  sortedShirts.female.XL +
  sortedShirts.female.XXL;

const Shirts = ({ sortedShirts }: { sortedShirts: sortedShirts }) => (
  <>
    <h3 className="font-bold">Męskie</h3>
    <p>S: {sortedShirts.male.S}</p>
    <p>M: {sortedShirts.male.M}</p>
    <p>L: {sortedShirts.male.L}</p>
    <p>XL: {sortedShirts.male.XL}</p>
    <p>XXL: {sortedShirts.male.XXL}</p>
    <h3 className="mt-4 font-bold">Damskie</h3>
    <p>S: {sortedShirts.female.S}</p>
    <p>M: {sortedShirts.female.M}</p>
    <p>L: {sortedShirts.female.L}</p>
    <p>XL: {sortedShirts.female.XL}</p>
    <p>XXL: {sortedShirts.female.XXL}</p>
  </>
);

export default async function Page() {
  const [membersWithShirts, organizers] = await Promise.all([
    fetchMembersWithShirts(),

    fetchOrganizers(),
  ]);

  const sortedMembersShirts = getSortedMembersShirts(membersWithShirts);
  const sortedOrganizersShirts = getSortedMembersShirts(organizers);

  const sortedShirts = getSortedShirts(
    sortedMembersShirts,
    sortedOrganizersShirts,
  );

  const organizersSortedShirtsSum = getShirtsSum(sortedOrganizersShirts);
  const membersSortedShirtsSum = getShirtsSum(sortedMembersShirts);
  const sortedShirtsSum = getShirtsSum(sortedShirts);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Koszulki</h1>
      </div>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mt-6">
          <h3>
            Suma wszystkich koszulek:{' '}
            <span className="font-bold">{sortedShirtsSum}</span>
          </h3>
        </div>
        <div className="mt-6">
          <h3>Koszulki organizatorów: {organizersSortedShirtsSum}</h3>
          <Shirts sortedShirts={sortedOrganizersShirts} />
        </div>
        <div className="mt-6">
          <h3>
            <Link
              href="/print/shirts-list"
              target="_blank"
              className="font-bold text-blue-600 underline"
            >
              Koszulki uczestników rajdu
            </Link>
            : {membersSortedShirtsSum}
          </h3>
          <Shirts sortedShirts={sortedMembersShirts} />
        </div>
      </div>
    </div>
  );
}
