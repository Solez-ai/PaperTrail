import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, FileText, Settings, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="PaperTrail" className="h-10 w-10" />
                <span className="text-2xl font-semibold tracking-tight text-foreground">PaperTrail</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <Link to="/">
                  <Button
                    variant={isActive('/') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant={isActive('/settings') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/invoice/new">
                <Button size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  New Invoice
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            PaperTrail © {new Date().getFullYear()} - All data stored locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
};
