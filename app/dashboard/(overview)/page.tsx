import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchGroupCount,
  fetchMembersCount,
  fetchMembersWithPTTKCardCount,
  fetchMembersWithShirts,
} from '@/app/lib/data';
import { getSession } from '@/app/lib/session';
import { getSortedMembersShirts } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: 'Home',
};

const AdminInfo = ({
  membersCount,
  membersWithPTTKCardCount,
  membersWithoutPTTKCardCount,
  membersWithShirts,
  groupCount,
}: {
  membersCount: number;
  membersWithPTTKCardCount: number;
  membersWithoutPTTKCardCount: number;
  membersWithShirts: {
    shirt_size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    shirt_type: 'damska' | 'męska';
  }[];
  groupCount: number;
}) => {
  const sortedMembersShirts = getSortedMembersShirts(membersWithShirts);

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <div className="">
        <p>
          Liczba zapisanych uczestników:{' '}
          <span className="font-bold">{membersCount}</span>
        </p>
        <p>
          Liczba osób z legitymacją PTTK:{' '}
          <span className="font-bold">{membersWithPTTKCardCount}</span>
        </p>
        <p>
          Liczba osób bez legitymacji PTTK:{' '}
          <span className="font-bold">{membersWithoutPTTKCardCount}</span>
        </p>
        <p>
          Liczba grup: <span className="font-bold">{groupCount}</span>
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/remarks"
          className="font-bold text-blue-600 underline"
        >
          Uwagi ze wszystkich grup
        </Link>
      </div>
      <div className="mt-4">
        <Link
          href="/print/insurance-list-with-no-pttk"
          target="_blank"
          className="font-bold text-blue-600 underline"
        >
          Lista ubezpieczeniowa uczestników bez legitymacji PTTK
        </Link>
      </div>
      <div className="">
        <Link
          href="/print/insurance-list-with-pttk"
          target="_blank"
          className="font-bold text-blue-600 underline"
        >
          Lista ubezpieczeniowa uczestników z legitymacją PTTK
        </Link>
      </div>

      <div className="mt-6">
        <h2>
          <Link
            href="/print/shirts-list"
            target="_blank"
            className="font-bold text-blue-600 underline"
          >
            Koszulki
          </Link>
          : {membersWithShirts.length}
        </h2>
        <h3 className="font-bold">Męskie</h3>
        <p>S: {sortedMembersShirts.male.S}</p>
        <p>M: {sortedMembersShirts.male.M}</p>
        <p>L: {sortedMembersShirts.male.L}</p>
        <p>XL: {sortedMembersShirts.male.XL}</p>
        <p>XXL: {sortedMembersShirts.male.XXL}</p>
        <h3 className="mt-4 font-bold">Damskie</h3>
        <p>S: {sortedMembersShirts.female.S}</p>
        <p>M: {sortedMembersShirts.female.M}</p>
        <p>L: {sortedMembersShirts.female.L}</p>
        <p>XL: {sortedMembersShirts.female.XL}</p>
        <p>XXL: {sortedMembersShirts.female.XXL}</p>
      </div>
    </div>
  );
};

export default async function Page() {
  const [
    membersCount,
    membersWithPTTKCardCount,
    groupCount,
    membersWithShirts,
    session,
  ] = await Promise.all([
    fetchMembersCount(),
    fetchMembersWithPTTKCardCount(),
    fetchGroupCount(),
    fetchMembersWithShirts(),
    getSession(),
  ]);

  const membersWithoutPTTKCardCount = membersCount - membersWithPTTKCardCount;
  const isAdmin = session.user.role === 'admin';

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {isAdmin && (
        <AdminInfo
          membersCount={membersCount}
          membersWithPTTKCardCount={membersWithPTTKCardCount}
          membersWithoutPTTKCardCount={membersWithoutPTTKCardCount}
          groupCount={groupCount}
          membersWithShirts={membersWithShirts}
        />
      )}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div> */}
    </main>
  );
}
