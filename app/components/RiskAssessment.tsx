import { Card } from '@/components/ui/card';

interface RiskAssessmentProps {
  data: any;
}

export default function RiskAssessment({ data }: RiskAssessmentProps) {
  return (
    <Card className="bg-[#1A1A1A] p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Risk Assessment</h3>
      <p className="text-gray-400">Coming Soon</p>
    </Card>
  );
} 