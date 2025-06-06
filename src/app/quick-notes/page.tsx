'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, FilePlus2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LOCAL_STORAGE_KEY = 'quickNotesApp_notes';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export default function QuickNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedNotes) {
      const parsedNotes: Note[] = JSON.parse(storedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        // Load the most recently modified note by default
        const sortedNotes = [...parsedNotes].sort((a,b) => b.lastModified - a.lastModified);
        loadNote(sortedNotes[0].id, parsedNotes);
      } else {
        createNewNote();
      }
    } else {
      createNewNote();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load notes on initial mount

  const loadNote = (id: string, notesSource?: Note[]) => {
    const notesToSearch = notesSource || notes;
    const noteToLoad = notesToSearch.find(n => n.id === id);
    if (noteToLoad) {
      setCurrentNoteId(noteToLoad.id);
      setNoteTitle(noteToLoad.title);
      setNoteContent(noteToLoad.content);
    }
  };
  
  const saveNotesToLocalStorage = (updatedNotes: Note[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const handleSaveNote = () => {
    if (!currentNoteId) {
      toast({ title: 'Error', description: 'No note selected to save.', variant: 'destructive' });
      return;
    }
    if (!noteTitle.trim()) {
      toast({ title: 'Error', description: 'Note title cannot be empty.', variant: 'destructive' });
      return;
    }

    const updatedNotes = notes.map(note =>
      note.id === currentNoteId ? { ...note, title: noteTitle, content: noteContent, lastModified: Date.now() } : note
    );
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    toast({ title: 'Note Saved', description: `"${noteTitle}" has been saved.` });
  };

  const createNewNote = () => {
    const newNoteId = `note_${Date.now()}`;
    const newNote: Note = {
      id: newNoteId,
      title: 'Untitled Note',
      content: '',
      lastModified: Date.now(),
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    loadNote(newNoteId, updatedNotes); // Load the new note into the editor
    toast({ title: 'New Note Created'});
  };

  const handleDeleteNote = () => {
    if (!currentNoteId || notes.length <= 1) {
      toast({ title: 'Cannot Delete', description: 'Cannot delete the last note or no note is selected.', variant: 'destructive' });
      return;
    }
    const updatedNotes = notes.filter(note => note.id !== currentNoteId);
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    
    // Load another note or create a new one if the list becomes empty (though guarded by notes.length > 1)
    if (updatedNotes.length > 0) {
      loadNote(updatedNotes[0].id, updatedNotes);
    } else {
       // This case should ideally not be reached due to the guard, but as a fallback:
      createNewNote();
    }
    toast({ title: 'Note Deleted', description: `"${noteTitle}" has been deleted.`, variant: 'destructive' });
  };


  const selectedNote = notes.find(n => n.id === currentNoteId);

  return (
    <ToolPageLayout title="Quick Notes" description="A simple space to jot down and save your thoughts. Notes are saved in your browser's local storage.">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)] md:h-[600px]">
        <Card className="w-full md:w-1/3 flex flex-col">
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle className="text-lg">Your Notes</CardTitle>
            <Button variant="outline" size="sm" onClick={createNewNote}><FilePlus2 className="mr-2 h-4 w-4" />New</Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-0">
            {notes.length === 0 ? (
              <p className="p-4 text-muted-foreground">No notes yet. Create one!</p>
            ) : (
            <Select onValueChange={(id) => loadNote(id)} value={currentNoteId || ""}>
              <SelectTrigger className="m-4 w-[calc(100%-2rem)]">
                <SelectValue placeholder="Select a note" />
              </SelectTrigger>
              <SelectContent>
                {notes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
                  <SelectItem key={note.id} value={note.id}>
                    {note.title.length > 25 ? note.title.substring(0,25) + "..." : note.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            )}
             <div className="p-4 pt-0 space-y-2">
               {notes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
                  <Button
                    key={note.id}
                    variant={note.id === currentNoteId ? "secondary" : "ghost"}
                    className="w-full justify-start truncate"
                    onClick={() => loadNote(note.id)}
                  >
                    {note.title}
                  </Button>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3 flex flex-col">
          {selectedNote ? (
            <>
              <CardHeader>
                 <Input
                    id="noteTitle"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note Title"
                    className="text-xl font-semibold border-0 shadow-none focus-visible:ring-0 px-1"
                  />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Start typing your note here..."
                  className="flex-grow resize-none h-full min-h-[200px]"
                  aria-label="Note content"
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleDeleteNote} disabled={notes.length <=1}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button onClick={handleSaveNote}>
                    <Save className="mr-2 h-4 w-4" /> Save Note
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a note to edit or create a new one.</p>
            </CardContent>
          )}
        </Card>
      </div>
      <Alert className="mt-8">
        <AlertTitle>Storage Information</AlertTitle>
        <AlertDescription>
         Your notes are saved directly in your browser's local storage. They are not uploaded to any server. Clearing your browser data might remove your notes.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
