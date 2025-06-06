
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Rocket, Settings } from 'lucide-react';

const LANDING_PREFERENCE_KEY = 'toolboxLandingPreference';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreferenceDialog, setShowPreferenceDialog] = useState(false);
  const [landingPreference, setLandingPreference] = useState<'show' | 'skip'>('show');
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem(LANDING_PREFERENCE_KEY);
    if (savedPreference === 'skip') {
      router.replace('/tools');
    } else {
      setInitialCheckDone(true); // Allow rendering of landing page
    }
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && progress < 100) {
      timer = setTimeout(() => setProgress(prev => Math.min(prev + 20, 100)), 100);
    } else if (progress === 100 && isLoading) {
      setIsLoading(false); // Stop loading animation
      setShowPreferenceDialog(true); // Show dialog after progress hits 100%
    }
    return () => clearTimeout(timer);
  }, [isLoading, progress]);

  const handleDiveIn = () => {
    setIsLoading(true);
    setProgress(0); // Reset progress
  };

  const handleSavePreference = () => {
    localStorage.setItem(LANDING_PREFERENCE_KEY, landingPreference);
    setShowPreferenceDialog(false);
    router.push('/tools');
  };

  if (!initialCheckDone && typeof window !== 'undefined' && localStorage.getItem(LANDING_PREFERENCE_KEY) === 'skip') {
    // Still waiting for initial redirect or user has preference to skip.
    // Render nothing or a minimal loader to avoid flash of landing content.
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8">
        <Rocket className="w-16 h-16 text-primary animate-pulse mb-4" />
        <p className="text-muted-foreground">Loading your experience...</p>
      </div>
    );
  }
  
  if (!initialCheckDone) {
    // This handles the case where localStorage hasn't been checked yet on the very first render.
    // Avoids rendering the landing page if a redirect is imminent.
    return null; 
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8">
      <Rocket className="w-24 h-24 text-primary mb-8 animate-bounce" />
      <h1 className="text-5xl md:text-6xl font-headline font-extrabold mb-6 
                     text-transparent bg-clip-text bg-gradient-to-r 
                     from-primary via-accent to-primary/70">
        Welcome to Your Ultimate Toolbox!
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        Streamline your tasks with a powerful suite of utilities. Ready to boost your productivity?
      </p>

      {!isLoading && !showPreferenceDialog && (
        <Button size="lg" onClick={handleDiveIn} className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
          <Rocket className="mr-3 h-5 w-5" />
          Let's Dive Into Toolbox!
        </Button>
      )}

      {isLoading && (
        <div className="w-full max-w-md mt-8">
          <Progress value={progress} className="w-full h-4" />
          <p className="text-sm text-muted-foreground mt-2 animate-pulse">Preparing your tools...</p>
        </div>
      )}

      <AlertDialog open={showPreferenceDialog} onOpenChange={setShowPreferenceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Landing Page Preference
            </AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to see this welcome page next time you visit, or go directly to the tools?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RadioGroup defaultValue={landingPreference} onValueChange={(value: 'show' | 'skip') => setLandingPreference(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="show" id="r1" />
                <Label htmlFor="r1">Show this landing page on next visit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skip" id="r2" />
                <Label htmlFor="r2">Don't show, go directly to tools</Label>
              </div>
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            {/* AlertDialogCancel removed as direct action is preferred here */}
            <Button onClick={handleSavePreference} className="w-full">Save Preference & Continue</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
