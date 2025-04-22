import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableAreaProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export const AssetDroppable = ({
  children,
  id,
  className,
}: DroppableAreaProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        "rounded-xl transition-all duration-100 border-blue-500/50 border-dashed",
        isOver && "bg-blue-900/20 border-blue-500/50 border-2 scale-[1.01]"
      )}
    >
      {children}
    </div>
  );
};
