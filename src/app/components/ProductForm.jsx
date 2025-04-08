import Categories from './Categories';

export default function ProductForm({ product }) {
  const [categories, setCategories] = useState(product?.categories || []);

  const handleCategoriesChange = (newCategories) => {
    setCategories(newCategories);
    // Si tienes un campo formData, actualízalo también
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Categories 
        categories={categories} 
        onCategoriesChange={handleCategoriesChange} 
      />
    </form>
  );
} 