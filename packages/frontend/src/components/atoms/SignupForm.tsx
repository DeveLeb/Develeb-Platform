'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignupForm = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <SignupFormField
          name="username"
          label="Username"
          placeholder="Enter your username"
          formControl={form.control}
        />
        <SignupFormField
          name="email"
          label="Email"
          placeholder="Enter your email"
          inputType="email"
          formControl={form.control}
        />
        <SignupFormField
          name="password"
          label="Password"
          placeholder="Enter your password"
          inputType="password"
          formControl={form.control}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
};

interface SignupFormFieldProps {
  name: keyof z.infer<typeof signupSchema>;
  label: string;
  placeholder: string;
  inputType?: string;
  formControl: any;
}

const SignupFormField: React.FC<SignupFormFieldProps> = ({ name, label, placeholder, inputType, formControl }) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={inputType || 'text'} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SignupForm;
