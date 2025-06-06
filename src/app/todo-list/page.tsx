'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY_TODO = 'todoListApp_todos';

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY_TODO);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const saveTodosToLocalStorage = (updatedTodos: TodoItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TODO, JSON.stringify(updatedTodos));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) {
      toast({ title: 'Error', description: 'Todo text cannot be empty.', variant: 'destructive' });
      return;
    }
    const newTodo: TodoItem = {
      id: `todo_${Date.now()}`,
      text: newTodoText,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
    setNewTodoText('');
    toast({ title: 'Todo Added', description: `"${newTodoText}" added to your list.` });
  };

  const toggleTodoCompletion = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleDeleteTodo = (id: string) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
    if (todoToDelete) {
      toast({ title: 'Todo Deleted', description: `"${todoToDelete.text}" removed.`, variant: 'destructive' });
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <ToolPageLayout title="To-Do List" description="Manage your tasks efficiently. Your list is saved in your browser's local storage.">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
            <Input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow"
              aria-label="New todo text"
            />
            <Button type="submit" size="icon" aria-label="Add task"><Plus /></Button>
          </form>

          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground">No tasks yet. Add some!</p>
          ) : (
            <div className="space-y-3">
              {todos.map(todo => (
                <div key={todo.id} className={`flex items-center p-3 rounded-md transition-colors ${todo.completed ? 'bg-muted/50 hover:bg-muted/70' : 'bg-card hover:bg-muted/30'} border`}>
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodoCompletion(todo.id)}
                    aria-labelledby={`todo-label-${todo.id}`}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    id={`todo-label-${todo.id}`}
                    className={`ml-3 flex-grow cursor-pointer text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {todo.text}
                  </label>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)} aria-label={`Delete task ${todo.text}`}>
                    <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {todos.length > 0 && (
            <div className="mt-6 text-sm text-muted-foreground flex justify-between">
              <p>Pending: {pendingCount}</p>
              <p>Completed: {completedCount}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Storage Information</AlertTitle>
        <AlertDescription>
         Your to-do list is saved directly in your browser's local storage. Clearing your browser data might remove your tasks.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
