"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Camera, CheckCircle, Upload } from "lucide-react";
import type { Vehicle } from "@/lib/types";

interface VehicleInspectionProps {
  vehicle: Vehicle;
  onComplete: () => void;
}

const inspectionItems = [
  { id: "exterior", label: "Tình trạng bên ngoài (trầy xước, móp méo)" },
  { id: "interior", label: "Tình trạng nội thất (ghế, bảng điều khiển)" },
  { id: "tires", label: "Tình trạng và áp suất lốp" },
  { id: "lights", label: "Tất cả đèn đều hoạt động" },
  { id: "battery", label: "Mức pin" },
  { id: "cleanliness", label: "Xe đã được vệ sinh" },
];

export function VehicleInspection({ vehicle, onComplete }: VehicleInspectionProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setCheckedItems((prev) => (checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)));
  };


  const handleSubmitInspection = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const isComplete = checkedItems.length === inspectionItems.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-secondary" />
          Kiểm tra xe
        </CardTitle>
        <CardDescription>
          Hoàn thành danh sách kiểm tra trước khi thuê
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            {/* Vehicle Info */}
            <div className="p-3 bg-secondary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{vehicle.model}</div>
                  <div className="text-sm text-muted-foreground">
                    Trạm: {vehicle.locationId} • ID xe: {vehicle.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Km hiện tại</div>
                  <div className="font-medium">
                    {Math.floor(vehicle.estimatedRange * 3.2)} Km
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection Checklist */}
            <div className="space-y-4">
              <h4 className="font-medium">Danh sách kiểm tra</h4>
              <div className="space-y-3">
                {inspectionItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleItemCheck(item.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={item.id} className="text-sm">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <Button
              onClick={handleSubmitInspection}
              disabled={!isComplete}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <FileText className="mr-2 h-4 w-4" />
              Hoàn tất kiểm tra
            </Button>

            {!isComplete && (
              <p className="text-xs text-muted-foreground text-center">
                Hãy kiểm tra và tick vào các ô tương ứng!
              </p>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Inspection Complete!</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
