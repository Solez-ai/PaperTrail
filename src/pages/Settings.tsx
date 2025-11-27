import { useState, useEffect } from 'react';
import { AppSettings, getSettings, saveSettings } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    // Load settings on mount
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    toast.success('Settings saved successfully');
    // Reload to ensure settings are reflected
    setTimeout(() => {
      setSettings(getSettings());
    }, 100);
  };

  const handleReset = () => {
    setResetDialogOpen(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('papertrail_settings');
    setSettings(getSettings());
    toast.success('Settings reset to defaults');
    setResetDialogOpen(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSettings({
          ...settings,
          branding: { ...settings.branding, logo: reader.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure default values for new invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Defaults</CardTitle>
          <CardDescription>These settings will apply to all new invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Prefix</Label>
              <Input
                value={settings.invoicePrefix}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                placeholder="INV"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(v) => setSettings({ ...settings, defaultCurrency: v })}
              >
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Template</Label>
              <Select
                value={settings.defaultTemplate}
                onValueChange={(v: any) => setSettings({ ...settings, defaultTemplate: v })}
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
              <Label>Default Payment Terms</Label>
              <Select
                value={settings.defaultPaymentTerms}
                onValueChange={(v) => setSettings({ ...settings, defaultPaymentTerms: v })}
              >
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize your invoice appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogoUpload} />
            {settings.branding.logo && (
              <div className="mt-2">
                <img src={settings.branding.logo} alt="Logo" className="h-20 border border-border rounded p-2" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.branding.primaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, primaryColor: e.target.value },
                  })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={settings.branding.primaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, primaryColor: e.target.value },
                  })}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.branding.secondaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, secondaryColor: e.target.value },
                  })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={settings.branding.secondaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, secondaryColor: e.target.value },
                  })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.branding.backgroundColor || '#ffffff'}
                onChange={(e) => setSettings({
                  ...settings,
                  branding: { ...settings.branding, backgroundColor: e.target.value },
                })}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={settings.branding.backgroundColor || '#ffffff'}
                onChange={(e) => setSettings({
                  ...settings,
                  branding: { ...settings.branding, backgroundColor: e.target.value },
                })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Footer Text</Label>
            <Input
              value={settings.branding.footerText}
              onChange={(e) => setSettings({
                ...settings,
                branding: { ...settings.branding, footerText: e.target.value },
              })}
              placeholder="Thank you for your business"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">Save Settings</Button>
        <Button onClick={handleReset} variant="outline">Reset to Defaults</Button>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onConfirm={confirmReset}
        title="Reset Settings"
        description="Are you sure you want to reset all settings to their default values? This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
