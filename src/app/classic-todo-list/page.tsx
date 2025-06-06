
'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, ListTodo } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY_TODO = 'classicTodoListApp_items';

export default function ClassicTodoListPage() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newItemText, setNewItemText] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY_TODO);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TODO, JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) {
      toast({ title: 'Error', description: 'Task cannot be empty.', variant: 'destructive' });
      return;
    }

    const newItem: TodoItem = {
      id: `todo_${Date.now()}`,
      text: newItemText.trim(),
      completed: false,
    };
    setItems([newItem, ...items]); // Add new items to the top
    setNewItemText('');
    toast({ title: 'Task Added', description: `"${newItem.text}" added to your list.` });
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
      toast({ title: 'Task Removed', description: `"${itemToDelete.text}" removed.`, variant: 'default' });
    }
  };

  const pendingItemsCount = items.filter(item => !item.completed).length;

  return (
    <ToolPageLayout title="Classic To-Do List" description="Organize your tasks with this simple and effective to-do list.">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center"><ListTodo className="mr-2 h-6 w-6 text-primary" />My Tasks</CardTitle>
          {items.length > 0 && <span className="text-sm text-muted-foreground">{pendingItemsCount} tasks pending</span>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="flex gap-3 mb-6 items-center">
            <div className="flex-grow">
              <label htmlFor="newItemText" className="sr-only">New Task</label>
              <Input
                id="newItemText"
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="e.g., Finish project report"
                aria-label="New task description"
              />
            </div>
            <Button type="submit" size="icon" aria-label="Add task"><Plus /></Button>
          </form>

          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your to-do list is empty. Add some tasks!</p>
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
                  <label
                    htmlFor={`item-${item.id}`}
                    id={`item-label-${item.id}`}
                    className={`flex-grow font-medium cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {item.text}
                  </label>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} aria-label={`Delete ${item.text}`}>
                    <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Storage Information</AlertTitle>
        <AlertDescription>
         Your tasks are saved directly in your browser's local storage. Clearing your browser data will remove your list.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
