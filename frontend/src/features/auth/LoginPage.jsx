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
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'owner@demo.com', password: 'Password123!' },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Welcome back');
      navigate('/');
    } catch (_error) {
      toast.error('Login failed. Seed the backend or check credentials.');
    }
  };

  return (
    <Card>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <Button loading={isLoading}>Log in</Button>
          <p className="text-center text-sm text-muted-foreground">
            New workspace? <Link className="font-medium text-foreground" to="/register">Create account</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
