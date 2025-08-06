import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { Text } from "react-native";

interface AcceptAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AcceptAlert({ open, setOpen }: AcceptAlertProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="mx-4 bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-black">
            Please read and accept the terms and policies to continue
          </DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-button text-white">
              <Text className="text-white">Close</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
