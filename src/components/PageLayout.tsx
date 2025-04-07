
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface PageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, sidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-grow w-full">
        {sidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-sm">
              <div className="sticky top-0 p-4 h-full overflow-y-auto">
                {sidebar}
              </div>
            </div>
            
            {/* Mobile Sidebar */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="fixed bottom-4 left-4 z-40 shadow-lg rounded-full h-12 w-12 bg-primary text-white hover:bg-primary/90"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px] pt-12">
                  {sidebar}
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
