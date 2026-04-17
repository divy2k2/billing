const services = [
  {
    title: "Plumbing Repairs",
    description: "Fix leaks, clogs, and plumbing issues in your home or business.",
    icon: "🔧"
  },
  {
    title: "Pipe Fitting & Installation",
    description: "Professional pipe installation, replacement, and fitting services.",
    icon: "🪈"
  },
  {
    title: "Drain Cleaning",
    description: "Clear clogged drains and maintain your plumbing system.",
    icon: "🚰"
  },
  {
    title: "Water Heater Services",
    description: "Installation, repair, and maintenance of water heaters.",
    icon: "♨️"
  },
  {
    title: "Hardware Supply",
    description: "Quality hardware materials for all your construction needs.",
    icon: "🏗️"
  },
  {
    title: "Emergency Services",
    description: "24/7 emergency plumbing services when you need us most.",
    icon: "🚨"
  }
];

export function ServicesList() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <div 
          key={index} 
          className={`service-card animate-fade-in-up stagger-${(index % 6) + 1}`}
        >
          <div className="service-icon">{service.icon}</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>{service.title}</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{service.description}</p>
        </div>
      ))}
    </div>
  );
}