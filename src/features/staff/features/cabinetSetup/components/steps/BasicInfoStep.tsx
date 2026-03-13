import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { SetupCabinetFormValues } from "../../schemas/cabinetSetup.schema";
// Assuming you have a Select component, or we can use a native select for now if not available easily.
// I will use native select or a simple mocked one if Select is complex to import without knowing the exact export.
// It seems from package.json `@radix-ui/react-select` is installed. Let's assume a standard shadcn/ui Select exists.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/features/admin/features/location/services/location.service";
import { cabinetSetupService } from "../../services/cabinetSetup.service";
import { useWatch } from "react-hook-form";

interface BasicInfoStepProps {
  form: UseFormReturn<SetupCabinetFormValues>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const locationId = useWatch({
    control: form.control,
    name: "locationId",
  });

  // Fetch locations
  const { data: areas, isLoading } = useQuery({
    queryKey: ["lockerAreas"],
    queryFn: () => locationService.getAll({ page: 1, limit: 100 }),
  });

  const { data: cabinetsData, isLoading: isLoadingCabinets } = useQuery({
    queryKey: ["cabinets-by-location", locationId],
    queryFn: () => cabinetSetupService.getCabinetsByLocation(locationId!, { page: 1, limit: 100 }),
    enabled: !!locationId,
  });

  const locations = areas?.data.locations || [];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
        <p className="text-sm text-muted-foreground">
          Chọn chi nhánh và nhập địa chỉ MAC của Raspberry Pi
        </p>
      </div>

      <FormField
        control={form.control}
        name="locationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location (Chi nhánh)</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("cabinetId", ""); // Reset cabinet when location changes
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading..." : "Chọn Location"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locations.map((area: any) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name} - {area.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cabinetId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cabinet (Cụm tủ)</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                // Auto fill MAC address and layout if cabinet is found
                const selectedCabinet = cabinetsData?.data?.cabinets?.find(c => c.id === value);
                if (selectedCabinet) {
                  form.setValue("macAddress", selectedCabinet.macAddress);
                  form.setValue("totalRows", selectedCabinet.totalRows);
                  form.setValue("totalColumns", selectedCabinet.totalColumns);
                }
              }} 
              value={field.value}
              disabled={!locationId || isLoadingCabinets}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCabinets ? "Loading..." : (!locationId ? "Vui lòng chọn Location trước" : "Chọn cụm tủ")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cabinetsData?.data?.cabinets?.map((cabinet) => (
                  <SelectItem key={cabinet.id} value={cabinet.id}>
                    {cabinet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="macAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Địa chỉ MAC (Raspberry Pi 5)</FormLabel>
            <FormControl>
              <Input placeholder="Ví dụ: DC:A6:32:00:00:00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
