import missionApples from "@/assets/mission-apples.jpg";
import missionMoving from "@/assets/mission-moving.jpg";
import missionParty from "@/assets/mission-party.jpg";
import missionDogs from "@/assets/mission-dogs.jpg";
import missionFence from "@/assets/mission-fence.jpg";
import missionTutoring from "@/assets/mission-tutoring.jpg";

export interface Mission {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  people: number;
  category: string;
  author: string;
  urgent: boolean;
  image: string;
}

export const missions: Mission[] = [
  {
    id: 1,
    title: "Ramassage de pommes dans mon verger",
    description: "Je cherche 3 personnes pour m'aider à ramasser les pommes ce week-end. Ambiance conviviale, cidre offert !",
    location: "Rouen, 76",
    date: "Sam. 1 Mars",
    people: 3,
    category: "Jardinage",
    author: "Marie L.",
    urgent: false,
    image: missionApples,
  },
  {
    id: 2,
    title: "Coup de main déménagement association",
    description: "Notre association déménage ses locaux. On a besoin de bras pour transporter cartons et meubles.",
    location: "Lyon, 69",
    date: "Dim. 2 Mars",
    people: 5,
    category: "Associations",
    author: "Thomas R.",
    urgent: true,
    image: missionMoving,
  },
  {
    id: 3,
    title: "Aide pour organiser une fête de quartier",
    description: "On prépare la fête de quartier : montage des stands, décoration et mise en place. Bonne humeur garantie !",
    location: "Nantes, 44",
    date: "Ven. 7 Mars",
    people: 8,
    category: "Événements",
    author: "Sophie M.",
    urgent: false,
    image: missionParty,
  },
  {
    id: 4,
    title: "Promenade de chiens au refuge",
    description: "Le refuge a besoin de bénévoles pour promener les chiens le mercredi après-midi. Venez avec le sourire !",
    location: "Bordeaux, 33",
    date: "Mer. 5 Mars",
    people: 4,
    category: "Animaux",
    author: "Lucas D.",
    urgent: false,
    image: missionDogs,
  },
  {
    id: 5,
    title: "Réparation clôture jardin partagé",
    description: "La clôture de notre jardin partagé a besoin d'un petit coup de neuf. Outils fournis !",
    location: "Toulouse, 31",
    date: "Sam. 8 Mars",
    people: 2,
    category: "Bricolage",
    author: "Claire B.",
    urgent: false,
    image: missionFence,
  },
  {
    id: 6,
    title: "Soutien scolaire pour collégiens",
    description: "Centre social cherche bénévoles pour aider des collégiens en maths et français, 2h par semaine.",
    location: "Marseille, 13",
    date: "Chaque mardi",
    people: 3,
    category: "Soutien scolaire",
    author: "Ahmed K.",
    urgent: true,
    image: missionTutoring,
  },
];
