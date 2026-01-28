import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Size } from "../types/size.types";

interface SizeTableProps {
  sizes: Size[];
  onEdit: (size: Size) => void;
  onDelete: (size: Size) => void;
}

export default function SizeTable({
  sizes,
  onEdit,
  onDelete,
}: SizeTableProps) {
  if (sizes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chưa có kích thước nào
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
              <TableHead>Chiều rộng (cm)</TableHead>
              <TableHead>Chiều cao (cm)</TableHead>
              <TableHead>Chiều sâu (cm)</TableHead>

              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes?.map((size) => (
              <TableRow key={size?.id}>
                <TableCell className="font-medium w-1/4">{size.name}</TableCell>
             
                <TableCell className="w-1/4">{size.width}</TableCell>
                <TableCell className="w-1/4">{size.height}</TableCell>
                <TableCell className="w-1/4">{size.depth}</TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(size)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(size)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
