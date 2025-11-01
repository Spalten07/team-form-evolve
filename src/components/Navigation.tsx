import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Dumbbell, BookOpen, CalendarDays, Menu, X, Users, ClipboardList, Mail, Trophy, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Inbox } from "./Inbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<"coach" | "player" | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("inboxMessages");
    if (stored) {
      const messages = JSON.parse(stored);
      setUnreadCount(messages.filter((m: any) => !m.read).length);
    }
  }, [inboxOpen]);

  // Fetch user role from database
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      return;
    }

    const fetchUserRole = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserRole(data.role as "coach" | "player");
      }
    };

    fetchUserRole();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Du har loggats ut");
      navigate("/auth");
    } catch (error) {
      toast.error("Kunde inte logga ut");
    }
  };

const coachNavLinks = [
  { to: "/exercises", label: "Övningsbank", icon: Dumbbell },
  { to: "/theory", label: "Teoribank", icon: BookOpen },
  { to: "/planner", label: "Planering", icon: CalendarDays },
  { to: "/players", label: "Mina spelare", icon: Users },
  { to: "/league-tables", label: "Tabeller", icon: Trophy },
];

const playerNavLinks = [
  { to: "/exercises", label: "Övningar", icon: Dumbbell },
  { to: "/theory", label: "Teoribank", icon: BookOpen },
  { to: "/player-calendar", label: "Kalender", icon: CalendarDays },
  { to: "/player-history", label: "Min träningshistorik", icon: ClipboardList },
];

  const navLinks = userRole === "coach" ? coachNavLinks : playerNavLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-primary-foreground font-bold text-xl">FT</span>
                  </div>
                  <span className="font-bold text-xl text-foreground hidden sm:inline">FotbollsTräning</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                    {userRole && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {userRole === "coach" ? "Tränare" : "Spelare"}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logga ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Inbox Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setInboxOpen(true)}
            >
              <Mail className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

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
      
      {/* Inbox Dialog */}
      <Inbox 
        open={inboxOpen} 
        onOpenChange={setInboxOpen}
        onUnreadCountChange={setUnreadCount}
      />
    </nav>
  );
};
