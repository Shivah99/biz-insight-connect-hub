
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { Bell, MessageSquare, Menu, X, User, LogOut } from "lucide-react";
import { UserRole } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useMessages();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-business-primary font-bold text-xl">
                BizInsight
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 text-gray-700 hover:text-business-primary"
              >
                Home
              </Link>
              <Link
                to="/businesses"
                className="px-3 py-2 text-gray-700 hover:text-business-primary"
              >
                Businesses
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-gray-700 hover:text-business-primary"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/messages" className="relative">
                  <MessageSquare className="text-gray-600 hover:text-business-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative rounded-full bg-gray-100 p-1 text-gray-600 hover:text-business-primary"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <span className="text-sm font-medium">
                        {user?.name}
                      </span>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    {user?.role === UserRole.GENERAL && (
                      <DropdownMenuItem onClick={() => navigate("/register-business")}>
                        Register Business
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-business-primary"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-business-primary hover:bg-business-dark"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-business-primary"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-business-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/businesses"
              className="block px-3 py-2 text-gray-700 hover:text-business-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Businesses
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-business-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 text-gray-700 hover:text-business-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {user?.role === UserRole.GENERAL && (
                  <Link
                    to="/register-business"
                    className="block px-3 py-2 text-gray-700 hover:text-business-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register Business
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-business-primary"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-business-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-business-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
