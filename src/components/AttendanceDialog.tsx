import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface Player {
  id: string;
  full_name: string;
}

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: string;
  activityTitle: string;
}

export const AttendanceDialog = ({ open, onOpenChange, activityId, activityTitle }: AttendanceDialogProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !activityId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get coach's team
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', userData.user.id)
          .single();

        if (!profileData?.team_id) return;

        // Get all players in team
        const { data: playersData, error: playersError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('team_id', profileData.team_id)
          .eq('role', 'player')
          .order('full_name');

        if (playersError) throw playersError;
        setPlayers(playersData || []);

        // Get existing attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('player_id, attended')
          .eq('activity_id', activityId);

        if (attendanceError) throw attendanceError;

        // Create attendance map
        const attendanceMap: Record<string, boolean> = {};
        (attendanceData || []).forEach(a => {
          attendanceMap[a.player_id] = a.attended;
        });
        setAttendance(attendanceMap);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error("Kunde inte hämta spelardata");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, activityId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert attendance records
      const records = players.map(player => ({
        activity_id: activityId,
        player_id: player.id,
        attended: attendance[player.id] || false
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(records, {
          onConflict: 'activity_id,player_id'
        });

      if (error) throw error;

      toast.success("Närvaro sparad");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast.error("Kunde inte spara närvaro");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Fyll i närvaro
          </DialogTitle>
          <DialogDescription>
            {activityTitle}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Laddar spelare...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Markera vilka spelare som deltog i denna aktivitet
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={player.id}
                    checked={attendance[player.id] || false}
                    onCheckedChange={(checked) => {
                      setAttendance(prev => ({
                        ...prev,
                        [player.id]: checked as boolean
                      }));
                    }}
                  />
                  <Label
                    htmlFor={player.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {player.full_name}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={saving}
              >
                Avbryt
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={saving}
              >
                {saving ? "Sparar..." : "Spara närvaro"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
