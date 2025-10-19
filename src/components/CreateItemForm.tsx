import React from "react"
import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Item } from '../types';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface CreateItemFormProps {
  onCreateItem: (item: Omit<Item, 'id'>) => void;
}

export function CreateItemForm({ onCreateItem }: CreateItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bags' as 'Bags' | 'Purses' | 'Belts',
    description: '',
    price: '',
    image: ''
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (features.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }

    const newItem: Omit<Item, 'id'> = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      image: formData.image,
      features
    };

    onCreateItem(newItem);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Bags',
      description: '',
      price: '',
      image: ''
    });
    setFeatures([]);
    setFeatureInput('');
    setImagePreview('');
    
    toast.success('Item created successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h2 className="mb-6 text-amber-900">Create New Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: 'Bags' | 'Purses' | 'Belts') =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bags">Bags</SelectItem>
                <SelectItem value="Purses">Purses</SelectItem>
                <SelectItem value="Belts">Belts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter item description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <Button type="button" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <span className="flex-1 text-sm">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
            Create Item
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
