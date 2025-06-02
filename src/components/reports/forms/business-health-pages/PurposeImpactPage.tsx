
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart } from 'lucide-react';

interface PurposeImpactPageProps {
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

const PurposeImpactPage: React.FC<PurposeImpactPageProps> = ({ form }) => {
  const trackingOptions = [
    { id: 'energy', label: 'Energy use / emissions' },
    { id: 'wellbeing', label: 'Staff well-being' },
    { id: 'ethics', label: 'Supply chain ethics' },
    { id: 'community', label: 'Community outcomes' },
    { id: 'none', label: 'None' }
  ];

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
            <Heart className="h-5 w-5" />
          </div>
          Purpose & Impact
          <Badge variant="outline" className="ml-auto">5 of 5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="trackingItems"
          render={() => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Which of the following does your business actively track? (Select all that apply)
              </FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {trackingOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="trackingItems"
                    render={({ field }) => (
                      <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option.id])
                              : field.onChange(field.value?.filter((value) => value !== option.id))
                          }}
                        />
                        <label className="font-medium flex-1">{option.label}</label>
                      </div>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="purposeInfluencesBuying"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Do your environmental/social commitments influence buying decisions of your top 3 clients?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="purpose-yes" />
                    <label htmlFor="purpose-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="purpose-no" />
                    <label htmlFor="purpose-no" className="font-medium">No</label>
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
          name="purposeCommercialValue"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                To what extent do you believe your purpose adds commercial value to your business?
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Rate from 1 (no value) to 5 (significant value)
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
          name="staffEmpowerment"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                How do you empower staff to take ownership of social or environmental goals?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe how you empower staff with social and environmental initiatives..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="netZeroCommitment"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Have you publicly stated a Net Zero or ESG commitment?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="net-yes" />
                    <label htmlFor="net-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="net-no" />
                    <label htmlFor="net-no" className="font-medium">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PurposeImpactPage;
