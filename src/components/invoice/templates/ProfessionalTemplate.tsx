import { Invoice, calculateLineTotal, calculateInvoiceTotals, formatCurrency } from '@/lib/storage';

interface TemplateProps {
  invoice: Invoice;
}

export const ProfessionalTemplate = ({ invoice }: TemplateProps) => {
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
  const rowBgEven = isDark ? '#1f2937' : '#f9fafb';
  const rowBgOdd = isDark ? '#111827' : '#ffffff';

  return (
    <div className="p-12" style={{ backgroundColor: invoice.branding.backgroundColor || '#ffffff', color: textColor }}>
      {/* Header with color accent */}
      <div 
        className="p-6 mb-8 -mx-12 -mt-12"
        style={{ backgroundColor: invoice.branding.primaryColor }}
      >
        <div className="flex justify-between items-start">
          <div>
            {invoice.branding.logo && (
              <img src={invoice.branding.logo} alt="Logo" className="h-14 mb-3 bg-white p-2 rounded" />
            )}
            <h1 className="text-3xl font-bold text-white">INVOICE</h1>
          </div>
          <div className="text-right text-white">
            <p className="text-2xl font-bold mb-1">{invoice.number}</p>
            <p className="text-sm opacity-90">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Client Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="p-6 rounded" style={{ backgroundColor: invoice.branding.secondaryColor + '15' }}>
          <h2 className="text-sm font-semibold uppercase mb-3" style={{ color: lightMutedColor }}>Bill To</h2>
          <div className="space-y-1">
            <p className="font-semibold text-lg" style={{ color: textColor }}>{invoice.clientInfo.name}</p>
            {invoice.clientInfo.company && <p style={{ color: mutedTextColor }}>{invoice.clientInfo.company}</p>}
            {invoice.clientInfo.address && (
              <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.clientInfo.address}</p>
            )}
            {invoice.clientInfo.email && <p className="text-sm" style={{ color: mutedTextColor }}>{invoice.clientInfo.email}</p>}
            {invoice.clientInfo.phone && <p className="text-sm" style={{ color: mutedTextColor }}>{invoice.clientInfo.phone}</p>}
          </div>
        </div>

        <div className="p-6 rounded" style={{ backgroundColor: invoice.branding.secondaryColor + '15' }}>
          <h2 className="text-sm font-semibold uppercase mb-3" style={{ color: invoice.branding.secondaryColor }}>Invoice Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: mutedTextColor }}>Invoice Number:</span>
              <span className="font-medium" style={{ color: textColor }}>{invoice.number}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: mutedTextColor }}>Issue Date:</span>
              <span className="font-medium" style={{ color: textColor }}>{new Date(invoice.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: mutedTextColor }}>Due Date:</span>
              <span className="font-medium" style={{ color: textColor }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: mutedTextColor }}>Payment Terms:</span>
              <span className="font-medium" style={{ color: textColor }}>{invoice.paymentTerms}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr 
              className="text-white"
              style={{ backgroundColor: invoice.branding.primaryColor }}
            >
              <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
              <th className="text-center py-3 px-4 font-semibold text-sm">Qty</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Unit Price</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id} style={{ backgroundColor: idx % 2 === 0 ? rowBgEven : rowBgOdd }}>
                <td className="py-3 px-4 text-sm" style={{ color: textColor }}>{item.description}</td>
                <td className="py-3 px-4 text-sm text-center" style={{ color: textColor }}>{item.quantity}</td>
                <td className="py-3 px-4 text-sm text-right" style={{ color: textColor }}>{formatCurrency(item.unitPrice, invoice.currency)}</td>
                <td className="py-3 px-4 text-sm text-right font-medium" style={{ color: textColor }}>{formatCurrency(calculateLineTotal(item), invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: mutedTextColor }}>Subtotal</span>
              <span className="font-medium" style={{ color: textColor }}>{formatCurrency(totals.subtotal, invoice.currency)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: mutedTextColor }}>Tax ({invoice.taxRate}%)</span>
                <span className="font-medium" style={{ color: textColor }}>{formatCurrency(totals.tax, invoice.currency)}</span>
              </div>
            )}
          </div>
          <div 
            className="flex justify-between text-lg font-bold text-white py-3 px-4 rounded"
            style={{ backgroundColor: invoice.branding.primaryColor }}
          >
            <span>Total Due</span>
            <span>{formatCurrency(totals.total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Payment & Notes */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {invoice.paymentInstructions && (
          <div className="p-6 rounded border-2" style={{ borderColor: invoice.branding.secondaryColor, backgroundColor: invoice.branding.secondaryColor + '10' }}>
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: invoice.branding.secondaryColor }}>Payment Instructions</h3>
            <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.paymentInstructions}</p>
          </div>
        )}
        {invoice.notes && (
          <div className="p-6 rounded border-2" style={{ borderColor: invoice.branding.secondaryColor, backgroundColor: invoice.branding.secondaryColor + '10' }}>
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: invoice.branding.secondaryColor }}>Notes</h3>
            <p className="text-sm whitespace-pre-line" style={{ color: mutedTextColor }}>{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {invoice.branding.footerText && (
        <div className="text-center pt-6 border-t text-sm" style={{ borderColor: isDark ? '#374151' : '#e5e7eb', color: mutedTextColor }}>
          {invoice.branding.footerText}
        </div>
      )}
    </div>
  );
};
