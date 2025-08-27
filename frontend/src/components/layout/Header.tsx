import { Package, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onAddProduct?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header = ({ onAddProduct, searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 gap-3 sm:gap-0">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Inventory</h1>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          <Button onClick={onAddProduct} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
