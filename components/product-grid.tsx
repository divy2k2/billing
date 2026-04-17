"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";

const categories = [
  { id: "pipes", name: "CPVC & UPVC Pipes", icon: "🪈" },
  { id: "fittings", name: "Fittings & Valves", icon: "🔧" },
  { id: "hardware", name: "Hardware & Plywood", icon: "🏗️" },
  { id: "sanitaryware", name: "Sanitaryware", icon: "🚿" }
];

const products = [
  {
    id: 1,
    category: "pipes",
    title: "1-inch CPVC Pipe (High Pressure)",
    snippet: "Corrosion-resistant, lead-free, suitable for hot and cold water distribution. ASTM F441 certified.",
    specs: "Diameter: 1\", Pressure Rating: 400 PSI, Temperature Range: 33°F to 180°F, Length: 10ft",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 2,
    category: "pipes",
    title: "2-inch UPVC Pipe (Schedule 40)",
    snippet: "Durable, lightweight, excellent chemical resistance. Perfect for drainage and irrigation systems.",
    specs: "Diameter: 2\", Schedule: 40, Pressure Rating: 150 PSI, Length: 10ft, Color: White",
    image: "https://images.unsplash.com/photo-1526401485004-8e0bb61ea2a7?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 3,
    category: "fittings",
    title: "CPVC 90° Elbow (1-inch)",
    snippet: "High-quality solvent weld fitting for reliable pipe connections. Lead-free and corrosion-resistant.",
    specs: "Size: 1\", Material: CPVC, Connection: Solvent Weld, Angle: 90°, Standards: ASTM F439",
    image: "https://images.unsplash.com/photo-1533089860892-a7b3b2f05940?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 4,
    category: "fittings",
    title: "Brass Ball Valve (1/2-inch)",
    snippet: "Full port ball valve with quarter-turn operation. Suitable for water, oil, and gas applications.",
    specs: "Size: 1/2\", Material: Brass, Type: Full Port, Pressure Rating: 600 PSI, Temperature: -20°F to 300°F",
    image: "https://images.unsplash.com/photo-1516542076529-1ea3854896b5?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 5,
    category: "hardware",
    title: "Marine Plywood Sheet (4x8 ft)",
    snippet: "High-grade plywood with excellent water resistance. Ideal for furniture, cabinetry, and marine use.",
    specs: "Size: 4x8 ft, Thickness: 1/2\", Grade: Marine, Core: Hardwood, Face: Veneer, Moisture Content: <12%",
    image: "https://images.unsplash.com/photo-1581092331795-2935ea752bcf?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 6,
    category: "hardware",
    title: "PVC Solvent Cement (16 oz)",
    snippet: "Fast-setting adhesive for PVC and CPVC pipes. Creates strong, leak-proof bonds.",
    specs: "Size: 16 oz, Material: PVC Cement, Set Time: 2-5 minutes, Cure Time: 24 hours, Color: Clear",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 7,
    category: "sanitaryware",
    title: "Chrome Bathroom Faucet",
    snippet: "Single-handle faucet with ceramic cartridge. Modern design with durable chrome finish.",
    specs: "Type: Single Handle, Finish: Chrome, Cartridge: Ceramic, Flow Rate: 1.5 GPM, Installation: Deck Mount",
    image: "https://images.unsplash.com/photo-1556228724-4b00a9a79bc0?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  },
  {
    id: 8,
    category: "sanitaryware",
    title: "Shower Drain Assembly",
    snippet: "Stainless steel drain with adjustable height. Includes strainer and rubber gasket.",
    specs: "Material: Stainless Steel, Size: 2\", Type: Adjustable, Finish: Brushed Nickel, Includes: Strainer & Gasket",
    image: "https://images.unsplash.com/photo-1502741126161-b048400d43be?auto=format&fit=crop&w=800&q=80",
    price: "Call for Price"
  }
];

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const pageSize = 4;

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setVisibleCount(pageSize);
  };

  const loadMoreProducts = () => {
    setVisibleCount(prev => Math.min(prev + pageSize, filteredProducts.length));
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="category-filters">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`category-filter ${selectedCategory === "all" ? "active" : ""}`}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`category-filter ${selectedCategory === category.id ? "active" : ""}`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button onClick={loadMoreProducts} className="btn-primary">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}