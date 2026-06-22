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
    email: z.string().email('Invalid email'),
    restaurantName: z.string().min(2, 'Restaurant name required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const RegisterPage = () => {
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
        role: 'OWNER',
      }).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Workspace created!');
      navigate('/app');
    } catch (error) {
      toast.error(error?.data?.message || 'Could not create account');
    }
  };

  return (
    <div className="mx-auto grid max-w-md gap-6 px-4 py-12">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Create Workspace</h1>
            <p className="mt-2 text-sm text-muted-foreground">Register your restaurant business</p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Your Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@restaurant.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Restaurant Name"
              placeholder="Your Restaurant"
              error={errors.restaurantName?.message}
              {...register('restaurantName')}
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
            <Button loading={isLoading}>Create Workspace</Button>
          </form>

          <div className="mt-6 space-y-3 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Already have a workspace?{' '}
              <Link className="font-medium text-foreground hover:underline" to="/login">
                Log in
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Want to order food instead?{' '}
              <Link className="font-medium text-foreground hover:underline" to="/register/customer">
                Create customer account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
