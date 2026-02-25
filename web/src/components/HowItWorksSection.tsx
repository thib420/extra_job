import { UserPlus, Search, HandHeart, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Inscrivez-vous",
    description: "Créez votre profil en quelques secondes. C'est gratuit et le restera toujours.",
  },
  {
    icon: Search,
    title: "Trouvez une mission",
    description: "Parcourez les annonces près de chez vous ou publiez votre propre demande d'aide.",
  },
  {
    icon: HandHeart,
    title: "Donnez un coup de main",
    description: "Proposez votre aide, échangez avec la personne et rendez-vous sur place.",
  },
  {
    icon: Star,
    title: "Partagez l'expérience",
    description: "Laissez un avis et faites grandir la communauté d'entraide autour de vous.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            En 4 étapes simples, rejoignez la communauté Extra Job.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center group">
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
