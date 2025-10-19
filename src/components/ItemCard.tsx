import React from "react"
import { Item } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function ItemCard({ item, onEdit, onDelete, index }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="w-full sm:w-48 h-48 flex-shrink-0">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-amber-900">{item.name}</h3>
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm mt-1">
                  {item.category}
                </span>
              </div>
              <p className="text-green-700 flex-shrink-0">₹{item.price}</p>
            </div>
            
            <p className="text-gray-600 text-sm">{item.description}</p>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-700">Features:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {item.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onEdit(item)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(item.id)}
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
