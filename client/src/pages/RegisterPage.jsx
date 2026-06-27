import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useRegisterMutation } from '../api/apiSlice.js';
import { setCredentials } from '../features/auth/authSlice.js';

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [registerAccount, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerAccount(form).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Account created');
      navigate('/profile');
    } catch (error) {
      toast.error(error?.data?.message || 'Could not register');
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent>
          <h1 className="mb-1 text-2xl font-semibold">Create customer account</h1>
          <p className="mb-5 text-sm text-muted-foreground">Save addresses and track your orders.</p>
          <form className="grid gap-4" onSubmit={submit}>
            {['name', 'email', 'phone', 'password'].map((field) => (
              <Input key={field} label={field[0].toUpperCase() + field.slice(1)} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            ))}
            <Button disabled={isLoading}>{isLoading ? 'Creating...' : 'Create account'}</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
