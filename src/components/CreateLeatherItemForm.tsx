import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useLeather } from '../context/LeatherContext';
import { LeatherCategory } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const LEATHER_CATEGORIES: { value: LeatherCategory; label: string }[] = [
  { value: 'shoe_upper', label: 'Shoe Upper' },
  { value: 'sports_leather', label: 'Sports Leather' },
  { value: 'upholestry', label: 'Upholestry' },
  { value: 'garment_and_goods', label: 'Garment & Goods' },
];

export function CreateLeatherItemForm() {
  const { createLeather, loading } = useLeather();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<LeatherCategory>('shoe_upper');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (features.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('features', JSON.stringify(features));
      formData.append('itemImageUrl', imageFile);

      await createLeather(formData);

      // Reset form on success
      setTitle('');
      setDescription('');
      setCategory('shoe_upper');
      setFeatures([]);
      setFeatureInput('');
      setImagePreview('');
      setImageFile(null);
    } catch (error) {
      console.error('Error creating leather product:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h2 className="mb-6 text-amber-900">Create Leather Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter leather title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v: LeatherCategory) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {LEATHER_CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter leather description"
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
                onChange={e => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={e => {
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
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                >
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

          <Button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Leather Item'}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}

