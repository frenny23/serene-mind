
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, BookHeart, MessageSquare, HeartPulse, Calendar, Wind, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md transition-all duration-300",
        scrolled 
          ? "bg-background/90 border-b border-border shadow-md" 
          : "bg-background/70"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse size={28} className="text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-serenity-500 to-calm-500 bg-clip-text text-transparent">
                Serene Mind
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/") && "bg-accent/50 text-primary"
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      (isActive("/breathing") || isActive("/mindgame")) && "bg-accent/50 text-primary"
                    )}
                  >
                    Wellness Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <Link to="/breathing">
                          <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-serenity-50 to-calm-100 dark:from-serenity-900 dark:to-calm-800 p-6 no-underline outline-none focus:shadow-md">
                            <Wind className="h-10 w-10 text-serenity-500" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Breathing Exercises
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Practice guided breathing techniques to reduce stress and anxiety.
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/journal"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span className="text-sm font-medium">Mood Journal</span>
                          </div>
                          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
                            Track your mood patterns over time.
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/mindgame"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center space-x-2">
                            <Gamepad2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Mind Games</span>
                          </div>
                          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
                            Mental refreshing games to improve cognitive function.
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/resources"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center space-x-2">
                            <BookHeart className="h-5 w-5" />
                            <span className="text-sm font-medium">Resources</span>
                          </div>
                          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
                            Access articles and guides on mental health.
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/resources">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/resources") && "bg-accent/50 text-primary"
                      )}
                    >
                      Resources
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/journal">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/journal") && "bg-accent/50 text-primary"
                      )}
                    >
                      Journal
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="ml-4 flex items-center space-x-3">
              <Link to="/chat">
                <Button 
                  className="bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 transition-colors"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI Chat
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="ml-2"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="mr-2"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-accent/50 transition-colors"
              )}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/resources" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/resources") ? "bg-primary/10 text-primary" : "hover:bg-accent/50 transition-colors"
              )}
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/journal" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/journal") ? "bg-primary/10 text-primary" : "hover:bg-accent/50 transition-colors"
              )}
              onClick={() => setIsOpen(false)}
            >
              Journal
            </Link>
            <Link 
              to="/breathing" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/breathing") ? "bg-primary/10 text-primary" : "hover:bg-accent/50 transition-colors"
              )}
              onClick={() => setIsOpen(false)}
            >
              Breathing
            </Link>
            <Link 
              to="/mindgame" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/mindgame") ? "bg-primary/10 text-primary" : "hover:bg-accent/50 transition-colors"
              )}
              onClick={() => setIsOpen(false)}
            >
              Mind Games
            </Link>
            <Link 
              to="/chat" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-serenity-500 to-calm-500 text-primary-foreground",
                "hover:from-serenity-600 hover:to-calm-600 transition-colors"
              )}
              onClick={() => setIsOpen(false)}
            >
              AI Chat
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
