<div align="center">

# PaperTrail

### Professional Invoice Generator

A modern, client-side invoice management system built for freelancers, small businesses, and professionals who need a fast, elegant solution for creating and managing invoices.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

---

</div>

## 📋 Overview

PaperTrail is a powerful, privacy-first invoice generator that runs entirely in your browser. All your data stays local—no server required, no data transmitted, complete control. Create professional invoices with beautiful templates, manage clients, track payments, and export to PDF with ease.

## ✨ Features

### Core Functionality

- **Invoice Management**
  - Create, edit, and delete invoices with an intuitive interface
  - Auto-save functionality (saves every 5 seconds)
  - Duplicate existing invoices for quick creation
  - Multiple invoice statuses: Draft, Sent, Paid, Overdue
  - Advanced search and filtering by invoice number or client name
  - Smart sorting by date, amount, or status

- **Client Management**
  - Save and manage client information
  - Auto-populate client details in new invoices
  - Store company details, tax IDs, contact information
  - Quick client selection from saved database

- **Professional Templates**
  - Three beautiful template options: Minimal, Professional, Modern
  - Fully customizable branding (logo, colors, footer text)
  - Responsive invoice preview with real-time updates
  - Export to high-quality PDF

- **Flexible Line Items**
  - Unlimited line items per invoice
  - Support for both percentage and fixed discounts
  - Automatic calculations for subtotals, tax, and totals
  - Quantity and unit price management

- **Customization**
  - Configurable invoice prefix (e.g., INV, BILL)
  - Multiple currency support (USD, EUR, GBP, INR, BDT)
  - Custom payment terms (Due on Receipt, Net 15/30/60)
  - Tax rate configuration
  - Brand color customization with live preview
  - Company logo upload support

### User Experience

- **Dark/Light Theme Support** via Next Themes
- **Responsive Design** optimized for desktop and mobile
- **Toast Notifications** for user feedback
- **Confirmation Dialogs** for destructive actions
- **Keyboard Navigation** and accessibility features
- **Local Storage Persistence** for complete privacy

## 🛠 Tech Stack

### Frontend Framework & Libraries

<table>
<tr>
<td width="50%" valign="top">

#### Core Technologies
- **React 18.3** - UI framework
- **TypeScript 5.8** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool
- **React Router DOM 6.30** - Client-side routing
- **TanStack React Query 5.83** - Data synchronization

#### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS
- **Radix UI Components** - Accessible primitives
- **Shadcn/ui** - Beautiful component library
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Conflict-free class merging
- **Next Themes** - Theme management

</td>
<td width="50%" valign="top">

#### UI Components & Features
- **Lucide React** - Icon system
- **React Hook Form 7.61** - Form management
- **Zod 3.25** - Schema validation
- **Date-fns 3.6** - Date manipulation
- **React Day Picker 8.10** - Date selection
- **Recharts 2.15** - Chart library
- **Sonner** - Toast notifications
- **Embla Carousel** - Carousel component
- **React Resizable Panels** - Split layouts
- **CMDK** - Command menu
- **Vaul** - Drawer component

</td>
</tr>
</table>

### Development Tools

- **ESLint** - Code linting with React hooks plugin
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS & Autoprefixer** - CSS processing
- **Lovable Tagger** - Component tagging (development mode)
- **Vite Plugin React SWC** - Fast refresh with SWC compiler

### Data Storage

- **LocalStorage API** - Client-side data persistence
  - Invoices collection
  - Client database
  - Application settings
  - Invoice counter for auto-numbering

## 📦 Installation

### Prerequisites

- Node.js 16.x or higher
- npm, pnpm, or bun package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paper-trail
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚀 Usage

### Creating Your First Invoice

1. Navigate to the Dashboard
2. Click "Create Invoice" button
3. Fill in client information (or select from saved clients)
4. Add line items with descriptions, quantities, and prices
5. Configure discounts and tax rates as needed
6. Customize branding and template in the preview panel
7. Save the invoice (auto-saves every 5 seconds)
8. Export to PDF when ready

### Customizing Settings

1. Navigate to Settings page
2. Configure default values:
   - Invoice prefix and numbering
   - Default currency
   - Preferred template style
   - Payment terms
3. Customize branding:
   - Upload company logo
   - Set brand colors (primary, secondary, background)
   - Define default footer text
4. Save settings to apply to new invoices

## 📁 Project Structure

```
paper-trail/
├── src/
│   ├── components/          # React components
│   │   ├── invoice/        # Invoice-specific components
│   │   │   ├── InvoiceForm.tsx      # Invoice editing form
│   │   │   ├── InvoicePreview.tsx   # Real-time preview
│   │   │   └── templates/           # Invoice templates
│   │   ├── ui/             # Reusable UI components (Shadcn)
│   │   ├── ClientManager.tsx        # Client management
│   │   ├── ConfirmDialog.tsx       # Confirmation dialogs
│   │   ├── Layout.tsx              # App layout wrapper
│   │   └── NavLink.tsx             # Navigation links
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx        # Theme provider
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── storage.ts              # LocalStorage operations
│   │   └── utils.ts                # Helper functions
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── InvoiceBuilder.tsx     # Invoice creation/editing
│   │   ├── Settings.tsx            # App settings
│   │   ├── Clients.tsx             # Client management page
│   │   ├── Index.tsx               # Landing page
│   │   └── NotFound.tsx            # 404 page
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── components.json        # Shadcn UI configuration
└── package.json           # Project dependencies

```

## 💾 Data Schema

### Invoice Interface

```typescript
interface Invoice {
  id: string;
  number: string;              // Auto-generated (e.g., INV-2024-001)
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
  branding: BrandingConfig;
  settings: InvoiceSettings;
  pdfSettings: PDFSettings;
  taxRate: number;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Client Interface

```typescript
interface ClientInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  company: string;
  taxId: string;
}

interface SavedClient extends ClientInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

### Line Item Interface

```typescript
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
}
```

## 🎨 Customization

### Theme Configuration

The application supports both light and dark themes through the `ThemeContext`. Theme switching is automatic based on system preferences, with manual override available.

### Template Customization

Three professional templates are included:
- **Minimal** - Clean and simple design
- **Professional** - Traditional business invoice
- **Modern** - Contemporary styling with bold accents

Each template supports full color customization and logo integration.

### Branding Options

- Custom logo upload (Base64 encoded storage)
- Primary brand color
- Secondary accent color
- Background color
- Custom footer text

## 🔒 Privacy & Security

- **100% Client-Side** - No data sent to servers
- **LocalStorage Only** - Data stays on your device
- **No Tracking** - Complete privacy
- **No Account Required** - Instant access
- **Offline Capable** - Works without internet

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build with development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires modern browser with LocalStorage API support.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available for personal and commercial use.

---

<div align="center">

**Built using React + TypeScript + Vite**

*PaperTrail - Making invoicing simple, professional, and private*

</div>
