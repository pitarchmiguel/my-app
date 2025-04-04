import Hero from './components/Hero';
import CategorySection from './components/CategorySection';

export default function Home() {

  const categories = {
    bocatas: "🥪 Bocadillos",
    bebidas: "🥤 Bebidas",
    cafes: "☕ Cafés",
    postres: "🍰 Postres",
    sandwiches: "🥪 Sandwiches",
    zumos: "🥤 Zumos",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="bg-white shadow-sm">
        <div className="container px-4">
          <div className="flex gap-4 overflow-x-scroll">
            {Object.entries(categories).map(([key, label]) => (
              <a 
                key={key} 
                href={`#${key}`}
                className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl block mb-2">{label.split(' ')[0]}</span>
                <span className="text-gray-700">{label.split(' ')[1]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
