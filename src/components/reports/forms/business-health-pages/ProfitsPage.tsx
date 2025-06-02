
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
import { TrendingUp } from 'lucide-react';

interface ProfitsPageProps {
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

const ProfitsPage: React.FC<ProfitsPageProps> = ({ form }) => {
  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          Profits
          <Badge variant="outline" className="ml-auto">4 of 5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="grossProfitMargin"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Do you know your gross profit margin by product/service — and is it above 30%?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="profit-yes" />
                    <label htmlFor="profit-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="profit-no" />
                    <label htmlFor="profit-no" className="font-medium">No</label>
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
          name="cashFlowProcess"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">Which best describes your cash flow process?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="A" id="cash-A" />
                    <label htmlFor="cash-A" className="font-medium flex-1">No forecasting</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="B" id="cash-B" />
                    <label htmlFor="cash-B" className="font-medium flex-1">Basic spreadsheet, updated irregularly</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="C" id="cash-C" />
                    <label htmlFor="cash-C" className="font-medium flex-1">Monthly forecast with triggers & review</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="D" id="cash-D" />
                    <label htmlFor="cash-D" className="font-medium flex-1">Weekly rolling forecast</label>
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
          name="pricingValue"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                How well does your pricing reflect your value and strategic positioning?
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Rate from 1 (poorly) to 5 (very well)
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
          name="invoiceFollowUp"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                Do you consistently follow up on unpaid invoices within 7 days of due date?
              </FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="invoice-yes" />
                    <label htmlFor="invoice-yes" className="font-medium">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="invoice-no" />
                    <label htmlFor="invoice-no" className="font-medium">No</label>
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
          name="debtorCreditorTrends"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium">
                What trends have you observed in your debtor/creditor days over the past 12 months? What's your plan?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the trends and your plan to address them..."
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

export default ProfitsPage;
