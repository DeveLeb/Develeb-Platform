import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthFormWrapperProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  children: ReactNode;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ title, subtitle, linkText, linkHref, children }) => {
  return (
    <div className="text-center text-[var(--green)]">
      <h1 className="text-3xl font-semibold mb-8">{title}</h1>
      <p className="text-sm mb-8">
        {subtitle}{' '}
        <Link href={linkHref} className="underline underline-offset-4 text-[var(--green)]">
          {linkText}
        </Link>
      </p>
      {children}
    </div>
  );
};

export default AuthFormWrapper;
