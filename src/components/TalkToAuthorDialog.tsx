
import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TalkToAuthorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TalkToAuthorDialog: React.FC<TalkToAuthorDialogProps> = ({ isOpen, onClose }) => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When the dialog opens, we insert the Eleven Labs widget
    if (isOpen && widgetContainerRef.current) {
      // Create the widget element
      const widgetElement = document.createElement('elevenlabs-convai');
      widgetElement.setAttribute('agent-id', 'ItDxB8phbywc1HCdaGou');
      
      // Clear any existing widgets and append the new one
      if (widgetContainerRef.current.firstChild) {
        widgetContainerRef.current.innerHTML = '';
      }
      widgetContainerRef.current.appendChild(widgetElement);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Talk to the Author</DialogTitle>
        </DialogHeader>
        <div ref={widgetContainerRef} className="min-h-[400px] w-full"></div>
      </DialogContent>
    </Dialog>
  );
};

export default TalkToAuthorDialog;
