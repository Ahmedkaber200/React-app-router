import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ModalProps = {
  isLoading?: boolean;
  open: boolean;
  onCancel?: (e: boolean) => void;
  onClick?: () => void;

};

export function ConfirmationModal({ open, isLoading, onCancel , onClick }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Do you really want to delete this customer?
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onCancel && onCancel(false)}>
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={onClick} type="submit" variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
