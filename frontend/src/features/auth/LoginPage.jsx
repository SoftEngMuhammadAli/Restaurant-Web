import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useLoginMutation } from '../../api/apiSlice.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice.js';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'owner@demo.com', password: 'Password123!' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Welcome back!');

      // Route based on user role
      if (response.data.user.role === 'CUSTOMER') {
        navigate('/account');
      } else {
        navigate('/app');
      }
    } catch {
      toast.error('Login failed. Check your credentials or try the demo account.');
    }
  };

  return (
    <div className="mx-auto grid max-w-md gap-6 px-4 py-12">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to your account</p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button loading={isLoading}>Log In</Button>
          </form>

          <div className="mt-6 space-y-3 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              New here?{' '}
              <Link className="font-medium text-foreground hover:underline" to="/register/customer">
                Order food
              </Link>
              {' or '}
              <Link className="font-medium text-foreground hover:underline" to="/register">
                Run a restaurant
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground">Demo Credentials:</p>
            <p className="mt-1 text-xs text-muted-foreground">
              <strong>Owner:</strong> owner@demo.com / Password123!
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              <strong>Customer:</strong> ariana@example.com / Password123!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
