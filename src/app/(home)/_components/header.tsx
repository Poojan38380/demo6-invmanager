"use client";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Search, LogIn, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeToggleButton } from "@/components/theme/ThemeSelectorButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { status } = useSession();

  // Optimize scroll handler with useCallback
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as HTMLElement).closest("header")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Inv.Manage
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {status === "authenticated" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full w-64"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
            </div>

            {/* Auth and Theme Buttons */}
            <div className="flex items-center space-x-2">
              {status === "authenticated" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="gap-2"
                >
                  <LogOut size={16} /> Logout
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signIn()}
                  className="gap-2"
                >
                  <LogIn size={16} /> Login
                </Button>
              )}
              <ThemeToggleButton />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggleButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-lg">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            {status === "authenticated" && (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Search */}
            <div className="px-4 py-2 relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full"
              />
              <Search
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
            </div>

            {/* Mobile Auth Button */}
            <div className="px-4 py-2">
              {status === "authenticated" ? (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => signOut()}
                >
                  <LogOut size={16} /> Logout
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full gap-2"
                  onClick={() => signIn()}
                >
                  <LogIn size={16} /> Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
