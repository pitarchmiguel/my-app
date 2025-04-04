const CategorySection = ({ title, children }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 