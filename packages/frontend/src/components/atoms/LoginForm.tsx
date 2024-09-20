'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <LoginFormField
          name="email"
          label="Email"
          placeholder="Enter your email"
          inputType="email"
          formControl={form.control}
        />
        <LoginFormField
          name="password"
          label="Password"
          placeholder="Enter your password"
          inputType="password"
          formControl={form.control}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
};

interface LoginFormFieldProps {
  name: keyof z.infer<typeof loginSchema>;
  label: string;
  placeholder: string;
  inputType?: string;
  formControl: any;
}

const LoginFormField: React.FC<LoginFormFieldProps> = ({ name, label, placeholder, inputType, formControl }) => {
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

export default LoginForm;
