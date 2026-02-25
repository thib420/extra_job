import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary-foreground/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <Heart className="w-12 h-12 mx-auto mb-6 text-primary-foreground/80" />
        <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4">
          Prêt à faire la différence ?
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-lg mx-auto mb-8">
          Rejoignez des milliers de personnes qui s'entraident au quotidien. Chaque coup de main compte.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" variant="secondary" className="text-base font-semibold px-8">
            Proposer mon aide
          </Button>
          <Button size="lg" variant="outline" className="text-base font-semibold px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            Publier une mission
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
