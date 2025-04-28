
import React, { useEffect, useRef, useState } from 'react';
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
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Check if the Eleven Labs script is loaded
  useEffect(() => {
    const isScriptLoaded = () => {
      return typeof window !== 'undefined' && 'customElements' in window && 
             customElements.get('elevenlabs-convai') !== undefined;
    };

    if (isOpen) {
      // If script is already loaded
      if (isScriptLoaded()) {
        console.log('Eleven Labs script already loaded');
        setWidgetLoaded(true);
        return;
      }

      // Script loading check
      const checkInterval = setInterval(() => {
        if (isScriptLoaded()) {
          console.log('Eleven Labs script detected as loaded');
          setWidgetLoaded(true);
          clearInterval(checkInterval);
        }
      }, 500);

      // Cleanup interval
      return () => clearInterval(checkInterval);
    }
  }, [isOpen]);

  useEffect(() => {
    // When the widget is loaded and the dialog is open, ensure widget rendering
    if (isOpen && widgetLoaded && widgetContainerRef.current) {
      console.log('Initializing widget in container');
      
      // Clear existing content and create widget
      if (widgetContainerRef.current.firstChild) {
        widgetContainerRef.current.innerHTML = '';
      }
      
      try {
        // Create widget element
        const widgetElement = document.createElement('elevenlabs-convai');
        widgetElement.setAttribute('agent-id', 'ItDxB8phbywc1HCdaGou');
        widgetContainerRef.current.appendChild(widgetElement);
        
        console.log('Widget element added to DOM');
      } catch (error) {
        console.error('Error creating widget:', error);
      }
    }
  }, [isOpen, widgetLoaded]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Talk to the Author</DialogTitle>
        </DialogHeader>
        <div ref={widgetContainerRef} className="min-h-[400px] w-full flex items-center justify-center">
          {!widgetLoaded && isOpen && (
            <div className="text-center py-8">
              <p>Loading conversation widget...</p>
              <div className="mt-2 animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TalkToAuthorDialog;
