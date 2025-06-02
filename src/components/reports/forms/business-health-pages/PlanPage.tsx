
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target } from 'lucide-react';

interface PlanPageProps {
  form: UseFormReturn<any>;
}

const RatingScale = ({ field, max = 5 }: { field: any; max?: number }) => (
  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2">
    {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
      <div key={rating} className="flex flex-col items-center gap-2">
        <RadioGroupItem 
          value={rating.toString()} 
          id={`rating-${rating}`}
          className="w-5 h-5"
        />
        <label htmlFor={`rating-${rating}`} className="text-sm font-medium text-muted-foreground">
          {rating}
        </label>
      </div>
    ))}
  </RadioGroup>
);

const PlanPage: React.FC<PlanPageProps> = ({ form }) => {
  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            <Target className="h-5 w-5" />
          </div>
          Plan
          <Badge variant="outline" className="ml-auto">2 of 5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="missionWritten"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Have you written down your mission in 1–2 sentences and shared it with your team?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="mission-yes" />
                    <label htmlFor="mission-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mission-no" />
                    <label htmlFor="mission-no" className="font-medium">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="scheduleAlignment"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                To what extent does your weekly schedule align with your stated mission and long-term business vision?
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Rate from 1 (not aligned) to 5 (completely aligned)
              </FormDescription>
              <FormControl>
                <RatingScale field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="exitStrategy"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">What is your defined exit strategy?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="A" id="exit-A" />
                    <label htmlFor="exit-A" className="font-medium flex-1">Retire and close</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="B" id="exit-B" />
                    <label htmlFor="exit-B" className="font-medium flex-1">Sell (trade sale or MBO)</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="C" id="exit-C" />
                    <label htmlFor="exit-C" className="font-medium flex-1">Employee buyout or succession</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="D" id="exit-D" />
                    <label htmlFor="exit-D" className="font-medium flex-1">Pass on to family</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="E" id="exit-E" />
                    <label htmlFor="exit-E" className="font-medium flex-1">None</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="futureBackThinking"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Do you use 'future-back thinking' to guide your strategic decisions and resource planning?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="future-yes" />
                    <label htmlFor="future-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="future-no" />
                    <label htmlFor="future-no" className="font-medium">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="nonNegotiables"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                What are the top three non-negotiables in your business plan that help you say 'no' to distractions?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List your top three non-negotiables..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PlanPage;
