import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useLoginMutation } from '../api/apiSlice.js';
import { setCredentials } from '../features/auth/authSlice.js';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: 'admin@restaurant.com', password: 'Password123!' });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(form).unwrap();
      dispatch(setCredentials(response.data));
      toast.success('Welcome back');
      navigate(response.data.user.role === 'CUSTOMER' ? '/profile' : '/staff');
    } catch (error) {
      toast.error(error?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent>
          <h1 className="mb-1 text-2xl font-semibold">Welcome back</h1>
          <p className="mb-5 text-sm text-muted-foreground">Log in as staff or customer.</p>
          <form className="grid gap-4" onSubmit={submit}>
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">New customer? <Link to="/register" className="font-semibold text-primary">Create account</Link></p>
          <div className="mt-5 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p>Admin: admin@restaurant.com / Password123!</p>
            <p>Customer: customer@example.com / Password123!</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
