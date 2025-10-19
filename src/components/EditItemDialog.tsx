import React from "react"
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Item } from '../types';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface EditItemDialogProps {
  item: Item | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
}

export function EditItemDialog({ item, open, onClose, onSave }: EditItemDialogProps) {
  const [formData, setFormData] = useState<Item | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      setImagePreview(item.image);
    }
  }, [item]);

  const handleAddFeature = () => {
    if (featureInput.trim() && formData) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        features: formData.features.filter((_, i) => i !== index)
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
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
    if (formData) {
      onSave(formData);
      toast.success('Item updated successfully!');
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the item details below and click save to apply changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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
            <p className="text-sm text-gray-500">Upload a new image or keep the existing one</p>
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
              {formData.features.map((feature, index) => (
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-amber-700 hover:bg-amber-800">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
