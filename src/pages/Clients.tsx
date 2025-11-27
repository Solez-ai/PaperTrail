import { ClientManager } from '@/components/ClientManager';

export default function Clients() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Clients</h1>
        <p className="text-muted-foreground">Manage your client database and information</p>
      </div>
      
      <ClientManager />
    </div>
  );
}
