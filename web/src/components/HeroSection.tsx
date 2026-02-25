import { useState } from "react";
import { MapPin, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-community.jpg";

const categories = [
  "Tout", "Jardinage", "Déménagement", "Événements", "Animaux", "Bricolage", "Soutien scolaire", "Courses", "Associations"
];

const HeroSection = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tout");

  return (
    <section className="relative min-h-[80vh] flex items-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Communauté d'entraide dans un jardin"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
            🤝 100% gratuit · 100% entraide
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
            Un coup de main
            <br />
            près de chez vous.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-lg mx-auto">
            Entrez votre localisation pour découvrir les missions d'entraide autour de vous.
          </p>

          {/* Location search bar */}
          <div className="bg-card rounded-xl p-2 shadow-card-hover">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Entrez votre ville ou code postal..."
                  className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto shrink-0 px-6">
                Trouver des missions
              </Button>
            </div>

            {/* Filter toggle */}
            <div className="border-t border-border mt-2 pt-2 flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtrer par catégorie
              </button>

              {activeCategory !== "Tout" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1"
                  onClick={() => setActiveCategory("Tout")}
                >
                  {activeCategory}
                  <X className="w-3 h-3" />
                </Badge>
              )}
            </div>

            {/* Category filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 px-2 pb-2 pt-1 animate-fade-in">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6 text-primary-foreground/70 text-sm">
            <span>📍 Lyon</span>
            <span>📍 Paris</span>
            <span>📍 Nantes</span>
            <span>📍 Roanne</span>
            <span className="hidden sm:inline">📍 Bordeaux</span>
            <span className="hidden sm:inline">📍 Toulouse</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
