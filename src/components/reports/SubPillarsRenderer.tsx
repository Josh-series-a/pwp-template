
import React from 'react';

interface SubPillar {
  Name: string;
  Key_Question: string;
  Signals_to_Look_For: string[];
  Red_Flags: string[];
  Scoring_Guidance: Record<string, string>;
  Score: number;
}

interface SubPillarsRendererProps {
  subPillars: any;
}

const SubPillarsRenderer: React.FC<SubPillarsRendererProps> = ({ subPillars }) => {
  // Safely parse subPillars if it's a string or already an array
  let pillarsArray: SubPillar[] = [];
  
  if (Array.isArray(subPillars)) {
    pillarsArray = subPillars;
  } else if (typeof subPillars === 'string') {
    try {
      pillarsArray = JSON.parse(subPillars);
    } catch (e) {
      console.error('Error parsing sub_pillars:', e);
      return <p className="text-muted-foreground">Error loading assessment data.</p>;
    }
  } else if (subPillars && typeof subPillars === 'object') {
    pillarsArray = subPillars;
  }

  if (!pillarsArray || pillarsArray.length === 0) {
    return <p className="text-muted-foreground">No assessment data available for this pillar.</p>;
  }

  return (
    <div className="space-y-6">
      {pillarsArray.map((pillar, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-lg">{pillar.Name}</h4>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Score: {pillar.Score}/10
            </div>
          </div>
          
          <div className="mb-3">
            <p className="font-medium text-blue-700 mb-1">Key Question:</p>
            <p className="text-sm">{pillar.Key_Question}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-green-700 mb-2">Signals to Look For:</p>
              <ul className="text-sm space-y-1">
                {pillar.Signals_to_Look_For?.map((signal, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-red-700 mb-2">Red Flags:</p>
              <ul className="text-sm space-y-1">
                {pillar.Red_Flags?.map((flag, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-600 mr-2">⚠</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-medium mb-2">Scoring Guidance:</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
              {Object.entries(pillar.Scoring_Guidance || {}).map(([range, description]) => (
                <div key={range} className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{range}</div>
                  <div className="text-gray-600">{description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubPillarsRenderer;
