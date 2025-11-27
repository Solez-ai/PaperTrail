import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Copy, Trash2, FileText } from 'lucide-react';
import { Invoice, getInvoices, deleteInvoice, formatCurrency, calculateInvoiceTotals } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const data = getInvoices();
    setInvoices(data);
  };

  const handleDelete = (id: string) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete);
      loadInvoices();
      toast.success('Invoice deleted successfully');
      setInvoiceToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDuplicate = (invoice: Invoice) => {
    const newInvoice = {
      ...invoice,
      id: crypto.randomUUID(),
      number: `${invoice.number}-COPY`,
      status: 'draft' as const,
    };
    
    localStorage.setItem('papertrail_draft', JSON.stringify(newInvoice));
    window.location.href = '/invoice/new';
  };

  const handleCopyNumber = async (invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(invoiceNumber);
      toast.success('Invoice number copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy invoice number');
    }
  };

  const filteredInvoices = invoices
    .filter(inv => 
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        const totalA = calculateInvoiceTotals(a.items, a.taxRate).total;
        const totalB = calculateInvoiceTotals(b.items, b.taxRate).total;
        return totalB - totalA;
      }
      return a.status.localeCompare(b.status);
    });

  const stats = {
    total: invoices.length,
    thisMonth: invoices.filter(inv => {
      const date = new Date(inv.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    outstanding: invoices
      .filter(inv => inv.status !== 'paid')
      .reduce((sum, inv) => sum + calculateInvoiceTotals(inv.items, inv.taxRate).total, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'sent': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your invoices and track payments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">{stats.thisMonth}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(stats.outstanding, 'USD')}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and manage all your invoices</CardDescription>
            </div>
            <Link to="/invoice/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number or client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No invoices match your search.' : 'Get started by creating your first invoice.'}
                </p>
                {!searchQuery && (
                  <Link to="/invoice/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Invoice
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredInvoices.map((invoice) => {
                  const totals = calculateInvoiceTotals(invoice.items, invoice.taxRate);
                  return (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{invoice.number}</h3>
                          <Badge variant={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {invoice.clientInfo.name} • {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(totals.total, invoice.currency)}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          <Link to={`/invoice/${invoice.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleCopyNumber(invoice.number, e)}
                            title="Copy invoice number"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(invoice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
