import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Select } from '../../components/ui/Select.jsx';

export const SettingsPage = () => (
  <div className="grid gap-5">
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-muted-foreground">Restaurant profile, tax, service charges, payment providers, and team roles.</p>
    </div>
    <Card className="max-w-3xl">
      <CardHeader><CardTitle>Restaurant profile</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Input label="Restaurant name" defaultValue="Demo Bistro" />
        <Input label="Currency" defaultValue="USD" />
        <Input label="Tax rate" defaultValue="8.5" />
        <Select label="Online ordering" defaultValue="true" options={[{ value: 'true', label: 'Enabled' }, { value: 'false', label: 'Disabled' }]} />
        <Button className="sm:col-span-2">Save settings</Button>
      </CardContent>
    </Card>
  </div>
);
