import { Invoice, LineItem, calculateLineTotal } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

export const InvoiceForm = ({ invoice, onChange }: InvoiceFormProps) => {
  const updateField = (field: keyof Invoice, value: any) => {
    onChange({ ...invoice, [field]: value });
  };

  const updateClientInfo = (field: keyof Invoice['clientInfo'], value: string) => {
    onChange({
      ...invoice,
      clientInfo: { ...invoice.clientInfo, [field]: value },
    });
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percentage',
    };
    onChange({ ...invoice, items: [...invoice.items, newItem] });
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    onChange({
      ...invoice,
      items: invoice.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const deleteLineItem = (id: string) => {
    if (invoice.items.length === 1) return;
    onChange({
      ...invoice,
      items: invoice.items.filter(item => item.id !== id),
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          ...invoice,
          branding: { ...invoice.branding, logo: reader.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyColorTheme = (theme: string) => {
    const themes = {
      default: { primary: '#2563eb', secondary: '#3b82f6', background: '#ffffff' },
      dark: { primary: '#3b82f6', secondary: '#60a5fa', background: '#1f2937' },
      pinkHell: { primary: '#dc2626', secondary: '#fb7185', background: '#fef2f2' },
      blueNight: { primary: '#1e40af', secondary: '#3b82f6', background: '#dbeafe' },
      greenGrass: { primary: '#16a34a', secondary: '#4ade80', background: '#f0fdf4' },
    };
    
    const colors = themes[theme as keyof typeof themes];
    if (colors) {
      onChange({
        ...invoice,
        branding: {
          ...invoice.branding,
          primaryColor: colors.primary,
          secondaryColor: colors.secondary,
          backgroundColor: colors.background,
        },
      });
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-4">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={invoice.number}
                onChange={(e) => updateField('number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Optional)</Label>
              <Input
                value={invoice.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Project Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={invoice.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={invoice.currency} onValueChange={(v) => updateField('currency', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="BDT">BDT (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={invoice.status} onValueChange={(v: any) => updateField('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name *</Label>
              <Input
                value={invoice.clientInfo.name}
                onChange={(e) => updateClientInfo('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={invoice.clientInfo.email}
                onChange={(e) => updateClientInfo('email', e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={invoice.clientInfo.company}
                onChange={(e) => updateClientInfo('company', e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={invoice.clientInfo.phone}
                onChange={(e) => updateClientInfo('phone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={invoice.clientInfo.address}
              onChange={(e) => updateClientInfo('address', e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tax ID</Label>
            <Input
              value={invoice.clientInfo.taxId}
              onChange={(e) => updateClientInfo('taxId', e.target.value)}
              placeholder="Tax ID Number"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Line Items</CardTitle>
            <Button onClick={addLineItem} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex gap-2 items-start">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                <div className="flex-1 space-y-3">
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Discount</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLineItem(item.id)}
                  disabled={invoice.items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax & Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={invoice.taxRate}
              onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Terms & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Terms</Label>
            <Select value={invoice.paymentTerms} onValueChange={(v) => updateField('paymentTerms', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment Instructions</Label>
            <Textarea
              value={invoice.paymentInstructions}
              onChange={(e) => updateField('paymentInstructions', e.target.value)}
              placeholder="Bank details, payment methods, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={invoice.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Additional notes for the client"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogoUpload} />
            {invoice.branding.logo && (
              <img src={invoice.branding.logo} alt="Logo" className="h-16 mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <Label>Color Themes</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => applyColorTheme('default')}>
                Default
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyColorTheme('dark')}>
                Dark Mode
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyColorTheme('pinkHell')}>
                Pink Hell
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyColorTheme('blueNight')}>
                Blue Night
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyColorTheme('greenGrass')}>
                Green Grass
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={invoice.branding.primaryColor}
                onChange={(e) => onChange({
                  ...invoice,
                  branding: { ...invoice.branding, primaryColor: e.target.value },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <Input
                type="color"
                value={invoice.branding.secondaryColor}
                onChange={(e) => onChange({
                  ...invoice,
                  branding: { ...invoice.branding, secondaryColor: e.target.value },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={invoice.branding.backgroundColor}
                onChange={(e) => onChange({
                  ...invoice,
                  branding: { ...invoice.branding, backgroundColor: e.target.value },
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={invoice.template}
                onValueChange={(v: any) => updateField('template', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Footer Text</Label>
              <Input
                value={invoice.branding.footerText}
                onChange={(e) => onChange({
                  ...invoice,
                  branding: { ...invoice.branding, footerText: e.target.value },
                })}
                placeholder="Thank you for your business"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDF Export Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fitToPage"
              checked={invoice.pdfSettings.fitToPage}
              onCheckedChange={(checked) => onChange({
                ...invoice,
                pdfSettings: { ...invoice.pdfSettings, fitToPage: checked as boolean },
              })}
            />
            <Label htmlFor="fitToPage" className="text-sm font-normal cursor-pointer">
              Fit to Single Page (compress if needed)
            </Label>
          </div>

          <div className="space-y-2">
            <Label>PDF Scale: {invoice.pdfSettings.scale.toFixed(2)}x</Label>
            <Slider
              value={[invoice.pdfSettings.scale]}
              onValueChange={([value]) => onChange({
                ...invoice,
                pdfSettings: { ...invoice.pdfSettings, scale: value },
              })}
              min={0.5}
              max={1.5}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Adjust PDF content size (0.5x = smaller, 1.5x = larger)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
