import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy } from "lucide-react";
import { useState } from "react";

const LeagueTables = () => {
  const [selectedAge, setSelectedAge] = useState("2008");
  const [selectedClub, setSelectedClub] = useState("all");

  const ageGroups = ["2008", "2009", "2010", "2011", "2012", "2013"];
  const clubs = ["Alla klubbar", "IFK Östersund", "Frösö IF", "Brunflo IK", "Lit IF"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Serietabeller
          </h1>
          <p className="text-muted-foreground text-sm">
            Se tabeller för olika åldersgrupper och klubbar
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-sm font-medium mb-2 block">Åldersgrupp</label>
            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Klubb</label>
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club, idx) => (
                  <SelectItem key={idx} value={idx === 0 ? "all" : club}>
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* League Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Division 3 Norra - {selectedAge}
            </CardTitle>
            <CardDescription className="text-xs">
              Aktuell tabellställning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">Lag</th>
                    <th className="text-center py-2 px-1">M</th>
                    <th className="text-center py-2 px-1">V</th>
                    <th className="text-center py-2 px-1">O</th>
                    <th className="text-center py-2 px-1">F</th>
                    <th className="text-center py-2 px-1">GM</th>
                    <th className="text-center py-2 px-1">IM</th>
                    <th className="text-center py-2 px-1">MS</th>
                    <th className="text-center py-2 px-1 font-bold">P</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">1</td>
                    <td className="py-2 px-2">Frösö IF</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">7</td>
                    <td className="text-center py-2 px-1">0</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">28</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">+20</td>
                    <td className="text-center py-2 px-1 font-bold">21</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">2</td>
                    <td className="py-2 px-2">IFK Östersund</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">5</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">22</td>
                    <td className="text-center py-2 px-1">12</td>
                    <td className="text-center py-2 px-1">+10</td>
                    <td className="text-center py-2 px-1 font-bold">17</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">3</td>
                    <td className="py-2 px-2">Brunflo IK</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">4</td>
                    <td className="text-center py-2 px-1">3</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">18</td>
                    <td className="text-center py-2 px-1">10</td>
                    <td className="text-center py-2 px-1">+8</td>
                    <td className="text-center py-2 px-1 font-bold">15</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">4</td>
                    <td className="py-2 px-2">Östersund FK</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">3</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">3</td>
                    <td className="text-center py-2 px-1">15</td>
                    <td className="text-center py-2 px-1">15</td>
                    <td className="text-center py-2 px-1">0</td>
                    <td className="text-center py-2 px-1 font-bold">11</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">5</td>
                    <td className="py-2 px-2">Lit IF</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">5</td>
                    <td className="text-center py-2 px-1">10</td>
                    <td className="text-center py-2 px-1">20</td>
                    <td className="text-center py-2 px-1">-10</td>
                    <td className="text-center py-2 px-1 font-bold">7</td>
                  </tr>
                  <tr className="border-b hover:bg-secondary/50">
                    <td className="py-2 px-2">6</td>
                    <td className="py-2 px-2">Ope IF</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">1</td>
                    <td className="text-center py-2 px-1">2</td>
                    <td className="text-center py-2 px-1">5</td>
                    <td className="text-center py-2 px-1">8</td>
                    <td className="text-center py-2 px-1">22</td>
                    <td className="text-center py-2 px-1">-14</td>
                    <td className="text-center py-2 px-1 font-bold">5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LeagueTables;
