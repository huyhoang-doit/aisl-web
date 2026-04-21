import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, User, Image as ImageIcon } from "lucide-react";
import type { TechWorkLog } from "../types/task.types";

interface WorkLogTableProps {
  workLogs: TechWorkLog[];
}

const WorkLogTable: React.FC<WorkLogTableProps> = ({ workLogs }) => {
  if (workLogs.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground bg-muted/10 rounded-md border border-dashed">
        Chưa có báo cáo công việc nào cho task này.
      </div>
    );
  }

  const parseParts = (partsJson?: string) => {
    try {
      if (!partsJson) return [];
      const parts = JSON.parse(partsJson);
      return Array.isArray(parts) ? parts : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="rounded-md border border-border bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[120px] text-xs uppercase font-semibold">Mã báo cáo</TableHead>
            <TableHead className="text-xs uppercase font-semibold">Kỹ thuật viên</TableHead>
            <TableHead className="text-xs uppercase font-semibold">Mô tả công việc</TableHead>
            <TableHead className="text-xs uppercase font-semibold">Linh kiện thay thế</TableHead>
            <TableHead className="text-xs uppercase font-semibold">Hình ảnh</TableHead>
            <TableHead className="text-xs uppercase font-semibold">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workLogs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/5">
              <TableCell className="font-mono text-[11px] font-medium">{log.code}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs font-medium">{log.technicianName || log.technicianId}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 max-w-[250px]">
                  <span className="text-xs line-clamp-2">{log.workDescription}</span>
                  {log.techNote && (
                    <span className="text-[10px] text-muted-foreground italic">Ghi chú: {log.techNote}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {parseParts(log.partsReplaced).length > 0 ? (
                    parseParts(log.partsReplaced).map((part: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1 font-normal">
                        {part.name || part}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3 text-muted-foreground" />
                    <span>Trước: {log.beforePhotoUrls?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3 text-muted-foreground" />
                    <span>Sau: {log.afterPhotoUrls?.length || 0}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-[10px]">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{log.startedAt ? new Date(log.startedAt).toLocaleString("vi-VN") : "-"}</span>
                  </div>
                  {log.completedAt && (
                    <Badge variant="success" className="w-fit text-[9px] py-0 h-4">
                      Xong: {new Date(log.completedAt).toLocaleString("vi-VN")}
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkLogTable;
