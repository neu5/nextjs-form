import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import {
  fetchGroupCount,
  fetchMembersCount,
  fetchMembersWithPTTKCardCount,
} from '@/app/lib/data';
import { getSession } from '@/app/lib/session';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function Page() {
  const [membersCount, membersWithPTTKCardCount, groupCount, session] =
    await Promise.all([
      fetchMembersCount(),
      fetchMembersWithPTTKCardCount(),
      fetchGroupCount(),
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
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
