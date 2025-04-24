import { Card } from '@/components/ui/card';

interface SmartSuggestionsProps {
  data: any;
}

export default function SmartSuggestions({ data }: SmartSuggestionsProps) {
  return (
    <Card className="bg-[#1A1A1A] p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Smart Suggestions</h3>
      <p className="text-gray-400">Coming Soon</p>
    </Card>
  );
} 