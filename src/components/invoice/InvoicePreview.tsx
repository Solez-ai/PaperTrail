import { Invoice } from '@/lib/storage';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const renderTemplate = () => {
    switch (invoice.template) {
      case 'minimal':
        return <MinimalTemplate invoice={invoice} />;
      case 'professional':
        return <ProfessionalTemplate invoice={invoice} />;
      case 'modern':
        return <ModernTemplate invoice={invoice} />;
      default:
        return <MinimalTemplate invoice={invoice} />;
    }
  };

  return (
    <div className="sticky top-4 h-[calc(100vh-180px)]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div 
            id="invoice-preview" 
            className="bg-white shadow-lg"
          >
            {renderTemplate()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
