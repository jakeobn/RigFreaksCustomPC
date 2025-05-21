
import { useState } from 'react';
import { createProduct } from '@/lib/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function ProductForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [stock, setStock] = useState('0');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        title,
        price,
        description,
        handle: title.toLowerCase().replace(/\s+/g, '-'),
        category,
        stock: parseInt(stock),
        specs: {},
        featuredImageUrl: '/assets/images/placeholder.jpg',
      });
      
      setTitle('');
      setPrice('');
      setDescription('');
      setStock('0');
      alert('Product created successfully');
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product Title"
        required
      />
      <Input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        step="0.01"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Input
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        type="number"
        required
      />
      <Select
        value={category}
        onValueChange={setCategory}
      >
        <option value="general">General</option>
        <option value="gaming">Gaming</option>
        <option value="components">Components</option>
      </Select>
      <Button type="submit">Create Product</Button>
    </form>
  );
}
