import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

export default function EmerykLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/emeryk2025-znaczek.png"
        width={100}
        height={100}
        className="hidden md:block"
        alt="Znaczek rajdowy"
        priority={true}
      />
      <Image
        src="/emeryk2025-znaczek.png"
        width={40}
        height={40}
        className="block md:hidden"
        alt="Znaczek rajdowy"
        priority={true}
      />
    </div>
  );
}
