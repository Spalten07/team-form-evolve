import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCircle, Plus, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserRole {
  role: 'coach' | 'player';
}

interface ProfileData {
  phone: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
}

export const RoleSwitcher = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activeRole, setActiveRole] = useState<string>("");
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [newRole, setNewRole] = useState<'coach' | 'player'>('player');
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    phone: "",
    address: "",
    guardian_name: "",
    guardian_phone: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all roles for this user
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (userRoles) {
      setRoles(userRoles);
    }

    // Fetch active role and profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, phone, address, guardian_name, guardian_phone')
      .eq('id', user.id)
      .single();

    if (profile) {
      setActiveRole(profile.role);
      setProfileData({
        phone: profile.phone || "",
        address: profile.address || "",
        guardian_name: profile.guardian_name || "",
        guardian_phone: profile.guardian_phone || "",
      });
    }
  };

  const switchRole = async (role: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id);

    if (error) {
      toast.error("Kunde inte byta roll");
      return;
    }

    setActiveRole(role);
    toast.success(`Bytte till ${role === 'coach' ? 'tränare' : 'spelare'}`);
    
    // Redirect based on role
    if (role === 'coach') {
      navigate('/coach-dashboard');
    } else {
      navigate('/player-dashboard');
    }
    
    window.location.reload();
  };

  const addNewRole = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Add role to user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: newRole });

      if (roleError) throw roleError;

      // If adding coach role, create a team
      if (newRole === 'coach') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        // Generate team code
        const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const { data: team, error: teamError } = await supabase
          .from('teams')
          .insert({
            name: `${profile?.full_name || 'Mitt'} lag`,
            coach_id: user.id,
            team_code: teamCode
          })
          .select('id')
          .single();

        if (teamError) throw teamError;

        // Update profile with team_id if not already set
        if (team) {
          await supabase
            .from('profiles')
            .update({ team_id: team.id })
            .eq('id', user.id);
        }
      }

      // If adding player role with team code, join team
      if (newRole === 'player' && teamCode) {
        const { data: team } = await supabase
          .from('teams')
          .select('id')
          .eq('team_code', teamCode)
          .single();

        if (team) {
          await supabase
            .from('profiles')
            .update({ team_id: team.id })
            .eq('id', user.id);
        }
      }

      toast.success(`La till ${newRole === 'coach' ? 'tränare' : 'spelare'}-roll`);
      setShowAddRole(false);
      setTeamCode("");
      fetchUserRoles();
    } catch (error) {
      toast.error("Kunde inte lägga till roll");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);

    if (error) {
      toast.error("Kunde inte spara profil");
      console.error(error);
    } else {
      toast.success("Profil uppdaterad");
      setShowEditProfile(false);
    }
    setLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aktiv roll: {activeRole === 'coach' ? 'Tränare' : 'Spelare'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roles.map((roleObj) => (
            <DropdownMenuItem
              key={roleObj.role}
              onClick={() => switchRole(roleObj.role)}
              disabled={roleObj.role === activeRole}
            >
              {roleObj.role === 'coach' ? 'Tränare' : 'Spelare'}
              {roleObj.role === activeRole && ' (aktiv)'}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditProfile(true)}>
            <User className="h-4 w-4 mr-2" />
            Redigera profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAddRole(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Lägg till roll
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lägg till ny roll</DialogTitle>
            <DialogDescription>
              Välj vilken roll du vill lägga till ditt konto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Roll</Label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'coach' | 'player')}
                className="w-full p-2 border rounded"
              >
                <option value="player">Spelare</option>
                <option value="coach">Tränare</option>
              </select>
            </div>
            {newRole === 'player' && (
              <div>
                <Label>Lagkod (valfritt)</Label>
                <Input
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  placeholder="Ange lagkod för att gå med i ett lag"
                />
              </div>
            )}
            <Button onClick={addNewRole} disabled={loading} className="w-full">
              Lägg till roll
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redigera profil</DialogTitle>
            <DialogDescription>
              Uppdatera din kontaktinformation och vårdnadshavare
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="070-123 45 67"
              />
            </div>
            <div>
              <Label htmlFor="address">Adress</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Gatuadress, Postnummer Stad"
              />
            </div>
            {activeRole === 'player' && (
              <>
                <div>
                  <Label htmlFor="guardian_name">Vårdnadshavares namn</Label>
                  <Input
                    id="guardian_name"
                    value={profileData.guardian_name}
                    onChange={(e) => setProfileData({ ...profileData, guardian_name: e.target.value })}
                    placeholder="Förnamn Efternamn"
                  />
                </div>
                <div>
                  <Label htmlFor="guardian_phone">Vårdnadshavares telefon</Label>
                  <Input
                    id="guardian_phone"
                    value={profileData.guardian_phone}
                    onChange={(e) => setProfileData({ ...profileData, guardian_phone: e.target.value })}
                    placeholder="070-123 45 67"
                  />
                </div>
              </>
            )}
            <Button onClick={saveProfile} disabled={loading} className="w-full">
              Spara ändringar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
