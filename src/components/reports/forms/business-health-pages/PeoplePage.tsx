
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
import { Users } from 'lucide-react';

interface PeoplePageProps {
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

const PeoplePage: React.FC<PeoplePageProps> = ({ form }) => {
  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
            <Users className="h-5 w-5" />
          </div>
          People
          <Badge variant="outline" className="ml-auto">3 of 5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="businessWithout30Days"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Which best describes how your business would operate without you for 30 days?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="A" id="days-A" />
                    <label htmlFor="days-A" className="font-medium flex-1">Would collapse entirely</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="B" id="days-B" />
                    <label htmlFor="days-B" className="font-medium flex-1">Would struggle, but survive</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="C" id="days-C" />
                    <label htmlFor="days-C" className="font-medium flex-1">Would continue, but at reduced effectiveness</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="D" id="days-D" />
                    <label htmlFor="days-D" className="font-medium flex-1">Would operate smoothly with minimal disruption</label>
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
          name="delegationAccountability"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Are the people you delegate to accountable for measurable results?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="delegation-yes" />
                    <label htmlFor="delegation-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="delegation-no" />
                    <label htmlFor="delegation-no" className="font-medium">No</label>
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
          name="rightPeopleConfidence"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                How confident are you that each person in your business is in the right seat, doing the right job?
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Rate from 1 (not confident) to 5 (very confident)
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
          name="teamDevelopmentTime"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                How much time do you spend hiring, mentoring, or developing your team per month?
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Rate from 1 (very little) to 5 (significant time)
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
          name="retentionSystems"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                What systems do you use to retain good people — beyond just salary?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your retention systems and strategies..."
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

export default PeoplePage;
