import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  imageSrc: string;
  headingText: string;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ imageSrc, headingText, children }) => {
  return (
    <main className="flex min-h-screen">
      <section className="relative w-1/2">
        <Image src={imageSrc} alt={headingText} layout="fill" objectFit="cover" className="brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-[var(--green)]">{headingText}</h1>
        </div>
      </section>

      <section className="w-1/2 flex items-center justify-center bg-[var(--white)] p-6">
        <div className="w-4/5 max-w-lg">{children}</div>
      </section>
    </main>
  );
};

export default AuthLayout;
