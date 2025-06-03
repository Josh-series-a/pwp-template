
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import CreditsDisplay from './CreditsDisplay';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  showAddButton = false,
  onAddClick,
  addButtonText = "Add New"
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <CreditsDisplay />
        {showAddButton && (
          <Button onClick={onAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
