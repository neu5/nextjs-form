import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { getSession } from '@/app/lib/session';
import AdminInfo from '@/app/ui/dashboard/admin-info';
import MemberInfo from '@/app/ui/dashboard/member-info';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function Page() {
  const session = await getSession();

  const isAdmin = session.user.role === 'admin';

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {isAdmin ? <AdminInfo /> : <MemberInfo />}
    </main>
  );
}
