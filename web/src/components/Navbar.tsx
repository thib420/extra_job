import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-extrabold text-xl text-foreground">
            Extra<span className="text-primary">Job</span>
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#missions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Missions
          </a>
          <a href="#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Catégories
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Comment ça marche
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">Se connecter</Button>
          <Button size="sm">Proposer une mission</Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <a href="#missions" className="py-2 text-sm font-medium text-muted-foreground">Missions</a>
            <a href="#categories" className="py-2 text-sm font-medium text-muted-foreground">Catégories</a>
            <a href="#how-it-works" className="py-2 text-sm font-medium text-muted-foreground">Comment ça marche</a>
            <Button variant="ghost" size="sm" className="justify-start">Se connecter</Button>
            <Button size="sm">Proposer une mission</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
