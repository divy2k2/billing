import { PlumberCard } from "@/components/plumber-card";

const plumbers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    photo: "/api/placeholder/150/150",
    specialization: "Full Home Piping",
    experience: "12+ years",
    rating: 4.8,
    completedJobs: 450,
    available: true,
    description: "Expert in complete home plumbing installations, water heater setups, and pipe repairs."
  },
  {
    id: 2,
    name: "Amit Singh",
    photo: "/api/placeholder/150/150",
    specialization: "Leakage Specialist",
    experience: "8+ years",
    rating: 4.9,
    completedJobs: 320,
    available: true,
    description: "Specialized in leak detection, repair, and prevention. Emergency services available 24/7."
  }
];

export function PlumberGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plumbers.map(plumber => (
        <PlumberCard key={plumber.id} plumber={plumber} />
      ))}
    </div>
  );
}