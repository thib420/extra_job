import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-extrabold text-lg text-foreground">
                Extra<span className="text-primary">Job</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plateforme d'entraide gratuite qui connecte les bonnes volontés.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-3">Découvrir</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Missions</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Catégories</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Carte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-3">Communauté</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Témoignages</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 Extra Job — Fait avec ❤️ pour l'entraide
        </div>
      </div>
    </footer>
  );
};

export default Footer;
