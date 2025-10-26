import { Item } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import React from 'react';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function ItemCard({ item, onEdit, onDelete, index }: ItemCardProps) {
  const finalPrice = item.price - (item.price * item.discount / 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row gap-3 p-3">
          <div className="w-full sm:w-32 h-32 flex-shrink-0">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-amber-900">{item.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                    {item.category}
                  </span>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                    {item.gender}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                {item.discount > 0 ? (
                  <>
                    <p className="text-green-700">₹{finalPrice.toFixed(0)}</p>
                    <p className="text-gray-400 line-through text-sm">₹{item.price}</p>
                    <p className="text-red-600 text-sm">{item.discount}% off</p>
                  </>
                ) : (
                  <p className="text-green-700">₹{item.price}</p>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-700">Features:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                {item.features.slice(0, 2).map((feature, idx) => (
                  <li key={idx} className="line-clamp-1">{feature}</li>
                ))}
                {item.features.length > 2 && (
                  <li className="text-gray-500">+{item.features.length - 2} more</li>
                )}
              </ul>
            </div>
            
            <div className="flex gap-2 pt-1">
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