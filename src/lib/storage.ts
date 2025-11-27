export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  company: string;
  taxId: string;
}

export interface SavedClient extends ClientInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  title: string;
  clientInfo: ClientInfo;
  items: LineItem[];
  currency: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  paymentInstructions: string;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  template: 'minimal' | 'professional' | 'modern';
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    footerText: string;
  };
  settings: {
    showDiscount: boolean;
    showTax: boolean;
    compactMode: boolean;
  };
  pdfSettings: {
    fitToPage: boolean;
    scale: number;
  };
  taxRate: number;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  defaultCurrency: string;
  invoicePrefix: string;
  defaultTemplate: 'minimal' | 'professional' | 'modern';
  defaultPaymentTerms: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    footerText: string;
  };
  pdfSettings: {
    fitToPage: boolean;
    scale: number;
  };
}

const STORAGE_KEYS = {
  INVOICES: 'papertrail_invoices',
  SETTINGS: 'papertrail_settings',
  COUNTER: 'papertrail_counter',
  CLIENTS: 'papertrail_clients',
};

export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
};

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getInvoices();
  const index = invoices.findIndex(inv => inv.id === invoice.id);
  
  if (index !== -1) {
    invoices[index] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    invoices.push({ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const deleteInvoice = (id: string): void => {
  const invoices = getInvoices().filter(inv => inv.id !== id);
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const defaults = {
    defaultCurrency: 'USD',
    invoicePrefix: 'INV',
    defaultTemplate: 'minimal' as const,
    defaultPaymentTerms: 'Net 30',
    branding: {
      logo: '',
      primaryColor: '#1e7a8c',
      secondaryColor: '#f97316',
      backgroundColor: '#ffffff',
      footerText: 'Thank you for your business',
    },
    pdfSettings: {
      fitToPage: true,
      scale: 1,
    },
  };
  
  if (!data) return defaults;
  
  const parsed = JSON.parse(data);
  return {
    ...defaults,
    ...parsed,
    branding: { ...defaults.branding, ...parsed.branding },
    pdfSettings: { ...defaults.pdfSettings, ...parsed.pdfSettings },
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const generateInvoiceNumber = (): string => {
  const settings = getSettings();
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.COUNTER) || '0') + 1;
  localStorage.setItem(STORAGE_KEYS.COUNTER, counter.toString());
  
  const year = new Date().getFullYear();
  const paddedCounter = counter.toString().padStart(3, '0');
  
  return `${settings.invoicePrefix}-${year}-${paddedCounter}`;
};

export const calculateLineTotal = (item: LineItem): number => {
  const subtotal = item.quantity * item.unitPrice;
  const discount = item.discountType === 'percentage' 
    ? subtotal * (item.discount / 100)
    : item.discount;
  return subtotal - discount;
};

export const calculateInvoiceTotals = (items: LineItem[], taxRate: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

export const formatCurrency = (amount: number, currency: string): string => {
  if (currency === 'BDT') {
    return `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Client Management Functions
export const getClients = (): SavedClient[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
};

export const saveClient = (client: SavedClient): void => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === client.id);
  
  if (index !== -1) {
    clients[index] = { ...client, updatedAt: new Date().toISOString() };
  } else {
    clients.push({ ...client, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const deleteClient = (id: string): void => {
  const clients = getClients().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};
