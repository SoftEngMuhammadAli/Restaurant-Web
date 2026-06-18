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

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  restaurantName: z.string().min(2),
  password: z.string().min(8),
});

export const RegisterPage = () => {
  const [registerAccount, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const response = await registerAccount(values).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Workspace created');
      navigate('/');
    } catch (_error) {
      toast.error('Could not create account');
    }
  };

  return (
    <Card>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Restaurant" error={errors.restaurantName?.message} {...register('restaurantName')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <Button loading={isLoading}>Create workspace</Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have access? <Link className="font-medium text-foreground" to="/login">Log in</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
