import { useParams, Link } from "react-router-dom";
import { missions } from "@/data/missions";
import { MapPin, Clock, Users, ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MissionMap from "@/components/MissionMap";

const MissionDetail = () => {
  const { id } = useParams();
  const mission = missions.find((m) => m.id === Number(id));

  if (!mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Mission introuvable</h1>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={mission.image} alt={mission.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 container mx-auto px-4">
            <div className="flex gap-2 mb-3">
              <Badge variant="secondary" className="backdrop-blur-sm bg-card/80">{mission.category}</Badge>
              {mission.urgent && <Badge variant="destructive">Urgent</Badge>}
            </div>
            <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-primary-foreground">
              {mission.title}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour aux missions
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-6 shadow-card mb-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">Détails</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Lieu</p>
                      <p className="text-sm font-medium text-foreground">{mission.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium text-foreground">{mission.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Personnes</p>
                      <p className="text-sm font-medium text-foreground">{mission.people} recherchées</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card mt-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  <MapPin className="inline w-5 h-5 text-primary mr-1 -mt-0.5" />
                  Localisation
                </h2>
                <p className="text-sm text-muted-foreground mb-3">{mission.location}</p>
                <MissionMap location={mission.location} title={mission.title} />
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-lg">
                    {mission.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground">{mission.author}</p>
                    <p className="text-xs text-muted-foreground">Membre depuis 2024</p>
                  </div>
                </div>

                <Button className="w-full mb-3" size="lg">
                  <Heart className="w-4 h-4 mr-2" /> Je propose mon aide
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="w-4 h-4 mr-2" /> Partager
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Service 100% gratuit · Entraide communautaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MissionDetail;
