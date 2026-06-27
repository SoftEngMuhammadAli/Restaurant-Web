import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useCreateReservationMutation } from '../api/apiSlice.js';

export const ReservePage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', partySize: 2, date: '', notes: '' });
  const [createReservation, { isLoading }] = useCreateReservationMutation();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await createReservation(form).unwrap();
      toast.success('Reservation requested');
      setForm({ name: '', phone: '', email: '', partySize: 2, date: '', notes: '' });
    } catch (error) {
      toast.error(error?.data?.message || 'Reservation failed');
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardContent>
          <h1 className="mb-1 text-3xl font-semibold">Reserve a table</h1>
          <p className="mb-6 text-muted-foreground">Tell us when you are coming and we will prepare the room.</p>
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Party size" type="number" value={form.partySize} onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })} />
              <Input label="Date and time" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button disabled={isLoading}>{isLoading ? 'Sending...' : 'Request reservation'}</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
