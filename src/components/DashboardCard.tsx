import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DashboardCardProps {
  title: string;
  value: string;
  unit: string;
  progress?: number;
  icon: React.ElementType;
}

const DashboardCard = ({ title, value, unit, progress, icon: IconComponent }: DashboardCardProps) => {
  return (
    <Card className="p-4 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {IconComponent && <IconComponent className="w-5 h-5 text-slate-500" />}
          <span className="text-sm font-medium text-slate-700">{title}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-lg font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-500">{unit}</div>
        {progress !== undefined && <Progress value={progress} className="h-2" />}
      </div>
    </Card>
  );
};

export default DashboardCard;
