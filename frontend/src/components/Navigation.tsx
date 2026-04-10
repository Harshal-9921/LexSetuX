import { Button } from "@/components/ui/button";
import { Scale, Users, Shield, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    const baseItems = [
      { 
        name: "Home", 
        href: user && profile ? (profile.role === 'customer' ? '/client-dashboard' : '/lawyer-dashboard') : "/" 
      },
      { name: "Services", href: "/#services" },
      { name: "📚 Precedents", href: "/precedents" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
    return baseItems;
  };

  const portalButtons = [
    { 
      name: "Customer Portal", 
      icon: Users, 
      variant: "trust" as const,
      description: "Describe your legal case"
    },
    { 
      name: "Lawyer Portal", 
      icon: Scale, 
      variant: "professional" as const,
      description: "Access legal insights"
    },
    { 
      name: "Admin Portal", 
      icon: Shield, 
      variant: "outline" as const,
      description: "Manage platform"
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-card-soft sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-hero-gradient p-1 rounded-lg flex items-center justify-center">
              <img src="/newlogo.png" alt="AI Legal System Logo" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-heading font-bold text-foreground">LexSetuX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavigationItems().map((item) => (
              item.href.startsWith('/#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-legal-blue transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className="text-muted-foreground hover:text-legal-blue transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              )
            ))}
          </div>

          {/* Auth-based Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {/* Show portal buttons based on user role */}
                {portalButtons
                  .filter(portal => {
                    if (!profile) return false;
                    if (portal.name === 'Customer Portal') return profile.role === 'customer';
                    if (portal.name === 'Lawyer Portal') return profile.role === 'lawyer';
                    if (portal.name === 'Admin Portal') return profile.role === 'admin';
                    return false;
                  })
                  .map((portal) => {
                    const Icon = portal.icon;
                    return (
                      <Button
                        key={portal.name}
                        variant={portal.variant}
                        size="sm"
                        className="group relative"
                        title={portal.description}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden xl:inline">{portal.name}</span>
                      </Button>
                    );
                  })}
                
                {/* User Profile & Logout */}
                <div className="flex items-center space-x-2 pl-2 border-l border-border">
                  {profile?.role === 'lawyer' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/lawyer-profile')}
                      title="Open lawyer profile page"
                      className="border-legal-blue/40 text-legal-blue"
                    >
                      <Scale className="h-4 w-4" />
                      <span className="hidden xl:inline">Lawyer Profile</span>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground hidden xl:inline">
                      {profile?.full_name || user.email}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden xl:inline ml-1">Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Show all portal buttons when not authenticated */}
                {portalButtons.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <Button
                      key={portal.name}
                      variant={portal.variant}
                      size="sm"
                      className="group relative"
                      title={portal.description}
                      onClick={() => navigate('/auth')}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{portal.name}</span>
                    </Button>
                  );
                })}
              </>
            )}
          </div>

          {/* Auth Button - Medium screens */}
          <div className="hidden md:block lg:hidden">
            {user ? (
              <div className="flex items-center gap-2">
                {profile?.role === 'lawyer' && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/lawyer-profile')}>
                    Lawyer Profile
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="hero" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-legal border-t border-border">
            <div className="px-4 py-6 space-y-4">
              {getNavigationItems().map((item) => (
                item.href.startsWith('/#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-muted-foreground hover:text-legal-blue transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-left w-full text-muted-foreground hover:text-legal-blue transition-colors"
                  >
                    {item.name}
                  </button>
                )
              ))}
              
              <div className="pt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    {/* Show portal buttons based on user role */}
                    {portalButtons
                      .filter(portal => {
                        if (!profile) return false;
                        if (portal.name === 'Customer Portal') return profile.role === 'customer';
                        if (portal.name === 'Lawyer Portal') return profile.role === 'lawyer';
                        if (portal.name === 'Admin Portal') return profile.role === 'admin';
                        return false;
                      })
                      .map((portal) => {
                        const Icon = portal.icon;
                        return (
                          <Button
                            key={portal.name}
                            variant={portal.variant}
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Icon className="h-4 w-4" />
                            {portal.name}
                          </Button>
                        );
                      })}
                    
                    {profile?.role === 'lawyer' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate('/lawyer-profile');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Scale className="h-4 w-4" />
                        Lawyer Profile
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    {portalButtons.map((portal) => {
                      const Icon = portal.icon;
                      return (
                        <Button
                          key={portal.name}
                          variant={portal.variant}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate('/auth');
                            setIsMenuOpen(false);
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          {portal.name}
                        </Button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;