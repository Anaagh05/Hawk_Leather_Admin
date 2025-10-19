import React from "react"
import { useState } from 'react';
import { Item, Order } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { ItemsListView } from './ItemsListView';
import { EditItemDialog } from './EditItemDialog';
import { CreateItemForm } from './CreateItemForm';
import { OrdersView } from './OrdersView';
import { ChangeStatusForm } from './ChangeStatusForm';
import { Package, PlusCircle, ShoppingCart, Edit3, LogOut, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface AdminPanelProps {
  items: Item[];
  orders: Order[];
  onLogout: () => void;
  onUpdateItems: (items: Item[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
}

type ViewType = 'Bags' | 'Purses' | 'Belts' | 'create' | 'orders' | 'changeStatus';

export function AdminPanel({ items, orders, onLogout, onUpdateItems, onUpdateOrders }: AdminPanelProps) {
  const [activeView, setActiveView] = useState<ViewType>('Bags');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedItem: Item) => {
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    onUpdateItems(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      onUpdateItems(updatedItems);
      toast.success('Item deleted successfully!');
    }
  };

  const handleCreateItem = (newItemData: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...newItemData,
      id: Date.now().toString()
    };
    onUpdateItems([...items, newItem]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    onUpdateOrders(updatedOrders);
  };

  const getFilteredItems = (category: 'Bags' | 'Purses' | 'Belts') => {
    return items.filter(item => item.category === category);
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Bags':
      case 'Purses':
      case 'Belts':
        return (
          <div>
            <h2 className="mb-6 text-amber-900">{activeView}</h2>
            <ItemsListView
              items={getFilteredItems(activeView)}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          </div>
        );
      case 'create':
        return <CreateItemForm onCreateItem={handleCreateItem} />;
      case 'orders':
        return <OrdersView orders={orders} />;
      case 'changeStatus':
        return <ChangeStatusForm orders={orders} onUpdateStatus={handleUpdateOrderStatus} />;
    }
  };

  const renderSidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <h1 className="text-amber-900">Hawk Exports</h1>
        <p className="text-gray-600 text-sm mt-1">Admin Panel</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <p className="text-xs uppercase text-gray-500 px-3 py-2">Categories</p>
          
          <Button
            variant={activeView === 'Bags' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeView === 'Bags' ? 'bg-amber-700 hover:bg-amber-800' : ''}`}
            onClick={() => handleViewChange('Bags')}
          >
            <Package className="w-4 h-4 mr-2" />
            Bags
          </Button>

          <Button
            variant={activeView === 'Purses' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeView === 'Purses' ? 'bg-amber-700 hover:bg-amber-800' : ''}`}
            onClick={() => handleViewChange('Purses')}
          >
            <Package className="w-4 h-4 mr-2" />
            Purses
          </Button>

          <Button
            variant={activeView === 'Belts' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeView === 'Belts' ? 'bg-amber-700 hover:bg-amber-800' : ''}`}
            onClick={() => handleViewChange('Belts')}
          >
            <Package className="w-4 h-4 mr-2" />
            Belts
          </Button>

          <div className="pt-4">
            <p className="text-xs uppercase text-gray-500 px-3 py-2">Actions</p>
            
            <Button
              variant={activeView === 'create' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeView === 'create' ? 'bg-amber-700 hover:bg-amber-800' : ''}`}
              onClick={() => handleViewChange('create')}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Item
            </Button>

            <Button
              variant={activeView === 'orders' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeView === 'orders' ? 'bg-amber-700 hover:bg-amber-800' : ''}`}
              onClick={() => handleViewChange('orders')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Status
            </Button>

            <Button
              variant={activeView === 'changeStatus' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeView === 'changeStatus' ? 'bg-amber-700 hover:bg-amber-800' : ''}`}
              onClick={() => handleViewChange('changeStatus')}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Change Status
            </Button>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-64 bg-white shadow-xl flex-col"
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0" aria-describedby="mobile-menu-description">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription id="mobile-menu-description" className="sr-only">
              Access all admin panel sections including categories, orders, and settings
            </SheetDescription>
            <div className="flex flex-col h-full bg-white">
              {renderSidebarContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 md:p-8 pt-16 md:pt-8">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>

      {/* Edit Dialog */}
      <EditItemDialog
        item={editingItem}
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
