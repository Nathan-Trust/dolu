import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

interface CustomCardProps {
  item: {
    label: string;
    value: string;
  };
  className?: string;
}

const CustomCard = ({ item, className }: CustomCardProps) => {
  return (
    <Card key={item.label} className={cn(" border-none ", className)}>
      <CardContent className="pt-6">
        <div className="flex justify-between  items-center">
          <div className="space-y-3 h-full">
            <div className="w-16 h-16 rounded-full  bg-lightGray" />
            <p className="font-medium text-md">{item.label}</p>
          </div>
          <p className="font-medium self-start text-3xl">
            {item.value || "***"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
