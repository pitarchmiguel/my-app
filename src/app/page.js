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
      
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Nuestras Categorías</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(categories).map(([key, label]) => (
                <a 
                  key={key} 
                  href={`#${key}`}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <span className="text-3xl mb-3">{label.split(' ')[0]}</span>
                  <span className="text-gray-700 font-medium">{label.split(' ')[1]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
