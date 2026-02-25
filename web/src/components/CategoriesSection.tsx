import { Sprout, Truck, PartyPopper, Dog, Wrench, GraduationCap, ShoppingBag, Users } from "lucide-react";

const categories = [
  { icon: Sprout, label: "Jardinage", count: 42, color: "bg-primary/10 text-primary" },
  { icon: Truck, label: "Déménagement", count: 28, color: "bg-secondary/10 text-secondary" },
  { icon: PartyPopper, label: "Événements", count: 35, color: "bg-primary/10 text-primary" },
  { icon: Dog, label: "Animaux", count: 19, color: "bg-secondary/10 text-secondary" },
  { icon: Wrench, label: "Bricolage", count: 31, color: "bg-primary/10 text-primary" },
  { icon: GraduationCap, label: "Soutien scolaire", count: 24, color: "bg-secondary/10 text-secondary" },
  { icon: ShoppingBag, label: "Courses", count: 16, color: "bg-primary/10 text-primary" },
  { icon: Users, label: "Associations", count: 22, color: "bg-secondary/10 text-secondary" },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Explorez les catégories
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Trouvez la mission qui vous correspond parmi nos différentes catégories d'entraide.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              className="group bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-foreground">{cat.label}</h3>
              <p className="text-sm text-muted-foreground">{cat.count} missions</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
