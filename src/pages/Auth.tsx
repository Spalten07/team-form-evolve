import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-pitch.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "player" as "player" | "coach"
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        toast.success("Inloggning lyckades!");
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: formData.role
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;
        toast.success("Konto skapat! Du kan nu logga in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Ett fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {isLogin ? "Logga in" : "Skapa konto"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? "Välkommen tillbaka till FotbollsTräning" 
                  : "Börja din träningsresa idag"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Fullständigt namn</Label>
                      <Input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Roll</Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as "player" | "coach" })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="player">Spelare</option>
                        <option value="coach">Tränare</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="din@email.se"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minst 6 tecken"
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? "Logga in" : "Skapa konto"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Har du inget konto? Skapa ett här" : "Har du redan ett konto? Logga in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Auth;