import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice, getInvoices, saveInvoice, generateInvoiceNumber, getSettings } from '@/lib/storage';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoiceBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeInvoice();
  }, [id]);

  useEffect(() => {
    if (invoice) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      const timeout = setTimeout(() => {
        saveInvoice(invoice);
      }, 5000);
      setAutoSaveTimeout(timeout);
    }
    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [invoice]);

  const initializeInvoice = () => {
    const settings = getSettings();
    
    if (id && id !== 'new') {
      const invoices = getInvoices();
      const existing = invoices.find(inv => inv.id === id);
      if (existing) {
        setInvoice(existing);
        return;
      }
    }

    const draft = localStorage.getItem('papertrail_draft');
    if (draft) {
      setInvoice(JSON.parse(draft));
      localStorage.removeItem('papertrail_draft');
      return;
    }

    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      number: generateInvoiceNumber(),
      title: '',
      clientInfo: {
        name: '',
        email: '',
        address: '',
        phone: '',
        company: '',
        taxId: '',
      },
      items: [{
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: 'percentage',
      }],
      currency: settings.defaultCurrency,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentTerms: settings.defaultPaymentTerms,
      paymentInstructions: '',
      notes: '',
      status: 'draft',
      template: settings.defaultTemplate,
      branding: { ...settings.branding },
      settings: {
        showDiscount: true,
        showTax: true,
        compactMode: false,
      },
      pdfSettings: { ...settings.pdfSettings },
      taxRate: 0,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoice(newInvoice);
  };

  const handleSave = () => {
    if (!invoice) return;
    saveInvoice(invoice);
    toast.success('Invoice saved successfully');
  };

  if (!invoice) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <InvoiceForm invoice={invoice} onChange={setInvoice} />
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
}
