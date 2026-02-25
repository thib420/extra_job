import { MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { missions } from "@/data/missions";

const MissionsSection = () => {
  return (
    <section id="missions" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Missions à la une
            </h2>
            <p className="text-muted-foreground">
              Des voisins près de chez vous ont besoin d'un coup de main.
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-1 text-primary">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {missions.map((mission) => (
            <Link
              to={`/mission/${mission.id}`}
              key={mission.id}
              className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={mission.image}
                  alt={mission.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="text-xs font-medium backdrop-blur-sm bg-card/80">
                    {mission.category}
                  </Badge>
                  {mission.urgent && (
                    <Badge variant="destructive" className="text-xs backdrop-blur-sm">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-heading font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                  {mission.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {mission.description}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {mission.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {mission.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {mission.people} pers.
                  </span>
                </div>
              </div>

              <div className="border-t border-border px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{mission.author}</span>
                <span className="text-xs text-primary font-semibold group-hover:underline">
                  Voir la mission →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline">Voir toutes les missions</Button>
        </div>
      </div>
    </section>
  );
};

export default MissionsSection;
