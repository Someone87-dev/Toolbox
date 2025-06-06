
'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, ShoppingCart, DollarSign } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GroceryItem {
  id: string;
  name: string;
  quantity: string; // Using string for flexibility, can be "1", "2 pcs", "500g"
  price: string; // Using string for input, will parse to number for calculation
  completed: boolean;
}

const LOCAL_STORAGE_KEY_GROCERY = 'groceryListApp_items';

export default function GroceryListPage() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [itemName, setItemName] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<string>('1');
  const [itemPrice, setItemPrice] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY_GROCERY);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const sum = items.reduce((acc, item) => {
        if (item.completed) return acc; // Don't include completed items in total price
        const price = parseFloat(item.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);
      setTotalPrice(sum);
    };
    calculateTotal();
    localStorage.setItem(LOCAL_STORAGE_KEY_GROCERY, JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast({ title: 'Error', description: 'Item name cannot be empty.', variant: 'destructive' });
      return;
    }
    const priceValue = parseFloat(itemPrice);
    if (itemPrice.trim() !== '' && (isNaN(priceValue) || priceValue < 0)) {
        toast({ title: 'Error', description: 'Please enter a valid price (0 or more).', variant: 'destructive' });
        return;
    }


    const newItem: GroceryItem = {
      id: `item_${Date.now()}`,
      name: itemName.trim(),
      quantity: itemQuantity.trim() || '1',
      price: itemPrice.trim() || '0',
      completed: false,
    };
    setItems([...items, newItem]);
    setItemName('');
    setItemQuantity('1');
    setItemPrice('');
    toast({ title: 'Item Added', description: `"${newItem.name}" added to your grocery list.` });
  };

  const toggleItemCompletion = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    if (itemToDelete) {
      toast({ title: 'Item Removed', description: `"${itemToDelete.name}" removed from the list.`, variant: 'default' });
    }
  };

  const pendingItemsCount = items.filter(item => !item.completed).length;

  return (
    <ToolPageLayout title="Smart Grocery List" description="Plan your shopping with item names, quantities, and prices. Tracks your estimated total.">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-6 w-6 text-primary" />My Grocery List</CardTitle>
          {items.length > 0 && <span className="text-sm text-muted-foreground">{pendingItemsCount} items pending</span>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 mb-6 items-end">
            <div className="flex-grow">
              <label htmlFor="itemName" className="sr-only">Item Name</label>
              <Input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Apples"
                aria-label="Item name"
              />
            </div>
            <div>
              <label htmlFor="itemQuantity" className="sr-only">Quantity</label>
              <Input
                id="itemQuantity"
                type="text"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                placeholder="e.g., 1kg or 2"
                aria-label="Item quantity"
              />
            </div>
            <div>
              <label htmlFor="itemPrice" className="sr-only">Price (per item/unit)</label>
              <Input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="Price (e.g., 2.99)"
                aria-label="Item price"
                step="0.01"
                min="0"
              />
            </div>
            <Button type="submit" size="icon" aria-label="Add item"><Plus /></Button>
          </form>

          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your grocery list is empty. Add some items above!</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className={`flex items-center p-3 rounded-md transition-colors gap-3 ${item.completed ? 'bg-muted/40 hover:bg-muted/60' : 'bg-card hover:bg-muted/20'} border`}>
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompletion(item.id)}
                    aria-labelledby={`item-label-${item.id}`}
                  />
                  <div className="flex-grow">
                    <label
                      htmlFor={`item-${item.id}`}
                      id={`item-label-${item.id}`}
                      className={`font-medium cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                    >
                      {item.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      <span>Qty: {item.quantity}</span>
                      {parseFloat(item.price) > 0 && <span> &bull; Price: ${parseFloat(item.price).toFixed(2)}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} aria-label={`Delete ${item.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {items.length > 0 && (
          <CardFooter className="mt-6 pt-4 border-t justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-500"/>Estimated Total:</h3>
            <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
          </CardFooter>
        )}
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Storage Information</AlertTitle>
        <AlertDescription>
         Your grocery list is saved directly in your browser's local storage. Clearing your browser data will remove your list. Completed items are not included in the total price.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
