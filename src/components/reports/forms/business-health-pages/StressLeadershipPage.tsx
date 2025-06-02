
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
import { Brain } from 'lucide-react';

interface StressLeadershipPageProps {
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

const StressLeadershipPage: React.FC<StressLeadershipPageProps> = ({ form }) => {
  return (
    <Card className="border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
            <Brain className="h-5 w-5" />
          </div>
          Stress & Leadership
          <Badge variant="outline" className="ml-auto">1 of 5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="hoursInVsOn"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                How many hours per week do you spend working "in" the business vs. "on" the business?
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Rate from 1 (mostly working "in") to 5 (mostly working "on")
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
          name="businessWithoutYou"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Can your business operate for one week without you being contacted?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="business-yes" />
                    <label htmlFor="business-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="business-no" />
                    <label htmlFor="business-no" className="font-medium">No</label>
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
          name="stressManagement"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Which best describes your approach to managing stress?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="A" id="stress-A" />
                    <label htmlFor="stress-A" className="font-medium flex-1">I suppress it and keep pushing</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="B" id="stress-B" />
                    <label htmlFor="stress-B" className="font-medium flex-1">I work longer hours to catch up</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="C" id="stress-C" />
                    <label htmlFor="stress-C" className="font-medium flex-1">I recognise it and adapt routines</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="D" id="stress-D" />
                    <label htmlFor="stress-D" className="font-medium flex-1">I use coaching or reflection proactively</label>
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
          name="valuesAlignment"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                To what degree do you feel you're making decisions aligned with your personal values and legacy?
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
          name="lastWeekendOff"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Describe the last moment you took a full weekend off. What made it possible (or impossible)?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your last full weekend off and what enabled or prevented it..."
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

export default StressLeadershipPage;
