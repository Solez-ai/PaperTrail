import { Invoice, calculateLineTotal, calculateInvoiceTotals, formatCurrency } from '@/lib/storage';

interface TemplateProps {
  invoice: Invoice;
}

export const MinimalTemplate = ({ invoice }: TemplateProps) => {
  const totals = calculateInvoiceTotals(invoice.items, invoice.taxRate);

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
      {/* Header */}
      <div className="mb-12">
        {invoice.branding.logo && (
          <img src={invoice.branding.logo} alt="Logo" className="h-16 mb-6" />
        )}
        <h1 className="text-4xl font-light tracking-tight" style={{ color: textColor }}>
          {invoice.title || 'INVOICE'}
        </h1>
      </div>

      {/* Invoice Info & Client Info */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: lightMutedColor }}>Invoice Details</h2>
          <div className="space-y-1 text-sm">
            <p><span style={{ color: lightMutedColor }}>Number:</span> {invoice.number}</p>
            <p><span style={{ color: lightMutedColor }}>Date:</span> {new Date(invoice.date).toLocaleDateString()}</p>
            <p><span style={{ color: lightMutedColor }}>Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><span style={{ color: lightMutedColor }}>Terms:</span> {invoice.paymentTerms}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: lightMutedColor }}>Bill To</h2>
          <div className="space-y-1 text-sm">
            <p className="font-medium" style={{ color: textColor }}>{invoice.clientInfo.name}</p>
            {invoice.clientInfo.company && <p style={{ color: textColor }}>{invoice.clientInfo.company}</p>}
            {invoice.clientInfo.email && <p style={{ color: mutedTextColor }}>{invoice.clientInfo.email}</p>}
            {invoice.clientInfo.phone && <p style={{ color: mutedTextColor }}>{invoice.clientInfo.phone}</p>}
            {invoice.clientInfo.address && (
              <p className="whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.clientInfo.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: isDark ? '#4b5563' : '#d1d5d8' }}>
              <th className="text-left py-3 text-xs uppercase tracking-wider font-medium" style={{ color: lightMutedColor }}>Description</th>
              <th className="text-right py-3 text-xs uppercase tracking-wider font-medium" style={{ color: lightMutedColor }}>Qty</th>
              <th className="text-right py-3 text-xs uppercase tracking-wider font-medium" style={{ color: lightMutedColor }}>Price</th>
              <th className="text-right py-3 text-xs uppercase tracking-wider font-medium" style={{ color: lightMutedColor }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                <td className="py-4 text-sm" style={{ color: textColor }}>{item.description}</td>
                <td className="py-4 text-sm text-right" style={{ color: textColor }}>{item.quantity}</td>
                <td className="py-4 text-sm text-right" style={{ color: textColor }}>{formatCurrency(item.unitPrice, invoice.currency)}</td>
                <td className="py-4 text-sm text-right" style={{ color: textColor }}>{formatCurrency(calculateLineTotal(item), invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: mutedTextColor }}>Subtotal</span>
            <span style={{ color: textColor }}>{formatCurrency(totals.subtotal, invoice.currency)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span style={{ color: mutedTextColor }}>Tax ({invoice.taxRate}%)</span>
              <span style={{ color: textColor }}>{formatCurrency(totals.tax, invoice.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold pt-2 border-t-2" style={{ borderColor: invoice.branding.secondaryColor }}>
            <span style={{ color: invoice.branding.secondaryColor }}>Total</span>
            <span style={{ color: invoice.branding.secondaryColor }}>{formatCurrency(totals.total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Payment & Notes */}
      {(invoice.paymentInstructions || invoice.notes) && (
        <div className="space-y-6">
          {invoice.paymentInstructions && (
            <div>
              <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: lightMutedColor }}>Payment Instructions</h3>
              <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.paymentInstructions}</p>
            </div>
          )}
          {invoice.notes && (
            <div>
              <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: lightMutedColor }}>Notes</h3>
              <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {invoice.branding.footerText && (
        <div className="mt-12 pt-6 border-t text-center text-sm" style={{ borderColor: isDark ? '#374151' : '#e5e7eb', color: mutedTextColor }}>
          {invoice.branding.footerText}
        </div>
      )}
    </div>
  );
};
