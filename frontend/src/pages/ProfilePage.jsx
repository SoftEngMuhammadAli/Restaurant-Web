import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';

export const ProfilePage = () => (
  <section className="mx-auto grid max-w-3xl gap-4 px-4 py-8">
    <h1 className="text-2xl font-semibold">Profile</h1>
    <Card>
      <CardHeader><CardTitle>Customer details</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" defaultValue="Ariana Chen" />
        <Input label="Email" defaultValue="ariana@example.com" />
        <Input className="sm:col-span-2" label="Default address" defaultValue="14 Market Street" />
      </CardContent>
    </Card>
  </section>
);
