import { Invoice, calculateLineTotal, calculateInvoiceTotals, formatCurrency } from '@/lib/storage';

interface TemplateProps {
  invoice: Invoice;
}

export const ModernTemplate = ({ invoice }: TemplateProps) => {
  const totals = calculateInvoiceTotals(invoice.items, invoice.taxRate);

  // Helper to determine if background is dark
  const isDarkBackground = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const isDark = isDarkBackground(invoice.branding.backgroundColor || '#ffffff');
  const textColor = isDark ? '#ffffff' : '#111827';
  const mutedTextColor = isDark ? '#d1d5db' : '#6b7280';
  const lightMutedColor = isDark ? '#9ca3af' : '#9ca3af';

  return (
    <div className="p-12" style={{ backgroundColor: invoice.branding.backgroundColor || '#ffffff', color: textColor }}>
      {/* Bold Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between mb-6">
          {invoice.branding.logo && (
            <img src={invoice.branding.logo} alt="Logo" className="h-20" />
          )}
          <div className="text-right">
            <h1 
              className="text-5xl font-bold mb-2"
              style={{ color: invoice.branding.primaryColor }}
            >
              INVOICE
            </h1>
            <p className="text-xl font-semibold" style={{ color: mutedTextColor }}>{invoice.number}</p>
          </div>
        </div>
        
        {invoice.title && (
          <h2 className="text-2xl font-semibold mb-4" style={{ color: textColor }}>{invoice.title}</h2>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div 
          className="p-4 rounded-lg text-white"
          style={{ backgroundColor: invoice.branding.primaryColor }}
        >
          <p className="text-xs uppercase opacity-90 mb-1">Invoice Date</p>
          <p className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
        </div>
        <div 
          className="p-4 rounded-lg text-white"
          style={{ backgroundColor: invoice.branding.primaryColor }}
        >
          <p className="text-xs uppercase opacity-90 mb-1">Due Date</p>
          <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
        <div 
          className="p-4 rounded-lg text-white"
          style={{ backgroundColor: invoice.branding.primaryColor }}
        >
          <p className="text-xs uppercase opacity-90 mb-1">Payment Terms</p>
          <p className="font-semibold">{invoice.paymentTerms}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-10 p-6 rounded-lg" style={{ backgroundColor: invoice.branding.secondaryColor + '15' }}>
        <h3 className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: lightMutedColor }}>Billed To</h3>
        <div>
          <p className="text-xl font-bold mb-1" style={{ color: textColor }}>{invoice.clientInfo.name}</p>
          {invoice.clientInfo.company && (
            <p className="font-medium mb-2" style={{ color: mutedTextColor }}>{invoice.clientInfo.company}</p>
          )}
          <div className="text-sm space-y-1" style={{ color: mutedTextColor }}>
            {invoice.clientInfo.address && (
              <p className="whitespace-pre-line">{invoice.clientInfo.address}</p>
            )}
            {invoice.clientInfo.email && <p>{invoice.clientInfo.email}</p>}
            {invoice.clientInfo.phone && <p>{invoice.clientInfo.phone}</p>}
            {invoice.clientInfo.taxId && <p>Tax ID: {invoice.clientInfo.taxId}</p>}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-10">
        <div 
          className="grid grid-cols-12 gap-4 py-3 px-4 rounded-t-lg text-white font-semibold text-sm"
          style={{ backgroundColor: invoice.branding.primaryColor }}
        >
          <div className="col-span-6">Item</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        
        {invoice.items.map((item, idx) => (
          <div 
            key={item.id}
            className={`grid grid-cols-12 gap-4 py-4 px-4 ${
              idx !== invoice.items.length - 1 ? 'border-b' : ''
            }`}
            style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}
          >
            <div className="col-span-6 font-medium" style={{ color: textColor }}>{item.description}</div>
            <div className="col-span-2 text-center" style={{ color: mutedTextColor }}>{item.quantity}</div>
            <div className="col-span-2 text-right" style={{ color: mutedTextColor }}>
              {formatCurrency(item.unitPrice, invoice.currency)}
            </div>
            <div className="col-span-2 text-right font-semibold" style={{ color: textColor }}>
              {formatCurrency(calculateLineTotal(item), invoice.currency)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-10">
        <div className="w-96">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between" style={{ color: mutedTextColor }}>
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(totals.subtotal, invoice.currency)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between" style={{ color: mutedTextColor }}>
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(totals.tax, invoice.currency)}</span>
              </div>
            )}
          </div>
          <div 
            className="flex justify-between text-xl font-bold text-white py-4 px-6 rounded-lg"
            style={{ backgroundColor: invoice.branding.primaryColor }}
          >
            <span>Amount Due</span>
            <span>{formatCurrency(totals.total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {(invoice.paymentInstructions || invoice.notes) && (
        <div className="space-y-6">
          {invoice.paymentInstructions && (
            <div className="p-6 rounded-lg border-2" style={{ borderColor: invoice.branding.secondaryColor, backgroundColor: invoice.branding.secondaryColor + '10' }}>
              <h3 className="font-semibold mb-2" style={{ color: invoice.branding.secondaryColor }}>Payment Information</h3>
              <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.paymentInstructions}</p>
            </div>
          )}
          {invoice.notes && (
            <div className="p-6 rounded-lg border-2" style={{ borderColor: invoice.branding.secondaryColor, backgroundColor: invoice.branding.secondaryColor + '10' }}>
              <h3 className="font-semibold mb-2" style={{ color: invoice.branding.secondaryColor }}>Additional Notes</h3>
              <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {invoice.branding.footerText && (
        <div className="mt-10 pt-6 border-t-2 text-center" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <p style={{ color: mutedTextColor }}>{invoice.branding.footerText}</p>
        </div>
      )}
    </div>
  );
};
