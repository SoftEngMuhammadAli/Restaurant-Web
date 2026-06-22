import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useRegisterMutation } from '../../api/apiSlice.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice.js';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const CustomerRegisterPage = () => {
  const [registerAccount, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      delete payload.confirmPassword;
      const response = await registerAccount({
        ...payload,
        role: 'CUSTOMER',
      }).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Account created! Welcome to our restaurant.');
      navigate('/account');
    } catch (error) {
      toast.error(error?.data?.message || 'Could not create account');
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Order food from your favorite restaurants
          </p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button loading={isLoading} className="mt-2">
            Create Account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link className="font-medium text-foreground hover:underline" to="/login">
              Log in
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Running a restaurant?{' '}
            <Link className="font-medium text-foreground hover:underline" to="/register">
              Create workspace
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
