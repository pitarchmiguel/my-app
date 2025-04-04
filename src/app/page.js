import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import MenuItem from './components/MenuItem';

export default function Home() {
  const menuData = {
    tostadas: [
      {
        name: "Tostada de Jamón",
        description: "Pan artesano con jamón ibérico y tomate rallado",
        price: 4.50,
        imageUrl: "/images/tostada-jamon.jpg"
      },
      {
        name: "Tostada de Aguacate",
        description: "Pan integral con aguacate, huevo y semillas",
        price: 5.00,
        imageUrl: "/images/tostada-aguacate.jpg"
      }
    ],
    bocatas: [
      {
        name: "Bocata de Tortilla",
        description: "Tortilla española con pan crujiente",
        price: 6.50,
        imageUrl: "/images/bocata-tortilla.jpg"
      },
      {
        name: "Bocata Vegetal",
        description: "Verduras a la plancha con hummus",
        price: 5.50,
        imageUrl: "/images/bocata-vegetal.jpg"
      }
    ],
    bebidas: [
      {
        name: "Zumo Natural",
        description: "Naranja recién exprimida",
        price: 3.00,
        imageUrl: "/images/zumo-naranja.jpg"
      },
      {
        name: "Agua Mineral",
        description: "Botella 500ml",
        price: 1.50,
        imageUrl: "/images/agua.jpg"
      }
    ],
    cafes: [
      {
        name: "Café con Leche",
        description: "Café arábica con leche cremosa",
        price: 2.50,
        imageUrl: "/images/cafe-leche.jpg"
      },
      {
        name: "Cappuccino",
        description: "Espresso con leche espumada",
        price: 3.00,
        imageUrl: "/images/cappuccino.jpg"
      }
    ],
    postres: [
      {
        name: "Tarta de Chocolate",
        description: "Chocolate belga con frutos rojos",
        price: 5.50,
        imageUrl: "/images/tarta-chocolate.jpg"
      },
      {
        name: "Flan Casero",
        description: "Receta tradicional con caramelo",
        price: 4.00,
        imageUrl: "/images/flan.jpg"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="py-8">
        {Object.entries(menuData).map(([category, items]) => (
          <CategorySection 
            key={category} 
            title={category.charAt(0).toUpperCase() + category.slice(1)}
          >
            {items.map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                description={item.description}
                price={item.price}
                imageUrl={item.imageUrl}
              />
            ))}
          </CategorySection>
        ))}
      </div>
    </main>
  );
}
