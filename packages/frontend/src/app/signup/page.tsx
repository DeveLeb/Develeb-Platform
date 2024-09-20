import SignupForm from '@/components/atoms/SignupForm';
import AuthLayout from '@/components/layouts/AuthLayout';
import AuthFormWrapper from '@/components/molecules/AuthFormWrapper';

export default function SignUp() {
  return (
    <AuthLayout imageSrc="/images/hero image.png" headingText="Join the Community">
      <AuthFormWrapper title="Signup" subtitle="Already have an account?" linkText="Login" linkHref="/login">
        <SignupForm />
      </AuthFormWrapper>
    </AuthLayout>
  );
}
