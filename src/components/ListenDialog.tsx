
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ListenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: number;
  chapterTitle: string;
}

const ListenDialog = ({ isOpen, onClose, chapterId, chapterTitle }: ListenDialogProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset audio state when the chapter changes
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [chapterId]);

  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const value = newValue[0];
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handleTimeChange = (newValue: number[]) => {
    const value = newValue[0];
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getAudioSource = (chapterId: number) => {
    if (chapterId === 1) {
      return '/lovable-uploads/ElevenLabs_2025-04-20T13_29_15_Daniel_pre_sp100_s50_sb75_se0_b_m2.mp3';
    }
    // For chapters without actual audio, we'll return the same file
    // In a real app, you would have different audio files for each chapter
    return '/lovable-uploads/ElevenLabs_2025-04-20T13_29_15_Daniel_pre_sp100_s50_sb75_se0_b_m2.mp3';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{chapterTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <audio
            ref={audioRef}
            src={getAudioSource(chapterId)}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          />
          
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="w-full mx-4"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button 
              size="icon"
              variant="ghost"
              onClick={skipBackward}
              className="h-10 w-10 rounded-full"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
            <Button 
              size="icon"
              variant="ghost"
              onClick={skipForward}
              className="h-10 w-10 rounded-full"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListenDialog;
