import { Text } from "react-native";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import {
  DISCLAIMER,
  PRIVACY_POLICY,
  TERMS_OF_USE,
} from "~/constants/terms-and-policies";

interface TermsAndPoliciesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TermsAndPolicies = ({ open, setOpen }: TermsAndPoliciesProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="mx-4">
        <DialogHeader>
          <DialogTitle className="text-center">Terms of use</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          <Text>{TERMS_OF_USE}</Text>
        </DialogDescription>

        <DialogHeader>
          <DialogTitle className="text-center">Disclaimer</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          <Text>{DISCLAIMER}</Text>
        </DialogDescription>

        <DialogHeader>
          <DialogTitle className="text-center">Privacy Policy</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          <Text>{PRIVACY_POLICY}</Text>
        </DialogDescription>
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
};
