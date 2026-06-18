import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';

export const CheckoutPage = () => (
  <section className="mx-auto grid max-w-3xl gap-4 px-4 py-8">
    <h1 className="text-2xl font-semibold">Checkout</h1>
    <Card>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" />
        <Input label="Phone" />
        <Input className="sm:col-span-2" label="Address" />
        <Select label="Payment" options={[{ value: 'STRIPE', label: 'Card' }, { value: 'CASH', label: 'Cash on delivery' }, { value: 'EASYPAISA', label: 'EasyPaisa' }]} />
        <Select label="Fulfillment" options={[{ value: 'DELIVERY', label: 'Delivery' }, { value: 'TAKEAWAY', label: 'Pickup' }]} />
        <Button className="sm:col-span-2">Place order</Button>
      </CardContent>
    </Card>
  </section>
);
