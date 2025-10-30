import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Dumbbell, BookOpen, CalendarDays, Menu, X, Users, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<"coach" | "player" | null>(null);
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("userRole") as "coach" | "player" | null;
    setUserRole(role);
  }, []);

const coachNavLinks = [
  { to: "/", label: "Byt roll", icon: Home },
  { to: "/exercises", label: "Övningsbank", icon: Dumbbell },
  { to: "/theory", label: "Teoribank", icon: BookOpen },
  { to: "/planner", label: "Planering", icon: CalendarDays },
  { to: "/players", label: "Mina spelare", icon: Users },
];

const playerNavLinks = [
  { to: "/", label: "Byt roll", icon: Home },
  { to: "/exercises", label: "Övningar", icon: Dumbbell },
  { to: "/theory", label: "Teoribank", icon: BookOpen },
  { to: "/player-calendar", label: "Kalender", icon: CalendarDays },
  { to: "/player-history", label: "Mina träningar", icon: ClipboardList },
];

  const navLinks = userRole === "coach" ? coachNavLinks : playerNavLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={userRole === "coach" ? "/home" : "/exercises"} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-xl">FT</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">FotbollsTräning</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.to)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(link.to)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
