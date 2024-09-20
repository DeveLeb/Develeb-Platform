import LoginForm from '@/components/atoms/LoginForm';
import AuthLayout from '@/components/layouts/AuthLayout';
import AuthFormWrapper from '@/components/molecules/AuthFormWrapper';

export default function Login() {
  return (
    <AuthLayout imageSrc="/images/hero image.png" headingText="Welcome Back!">
      <AuthFormWrapper title="Login" subtitle="Don't have an account?" linkText="Sign Up" linkHref="/signup">
        <LoginForm />
      </AuthFormWrapper>
    </AuthLayout>
  );
}
