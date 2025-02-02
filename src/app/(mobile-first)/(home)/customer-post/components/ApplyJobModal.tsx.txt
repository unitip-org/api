// src\app\(mobile-first)\(home)\customer-post\components\ApplyJobModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createCustomerRequestApplication } from "../action";
import { Textarea } from "@/components/ui/textarea";

const applicationSchema = z.object({
  fee: z
    .number()
    .min(1000, "Fee must be at least Rp 1.000")
    .max(10000000, "Fee cannot exceed Rp 10.000.000"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  isAuthenticated?: boolean;
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  postId,
  isAuthenticated,
}: //   onSubmit,
ApplyJobModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fee: 0,
    },
  });
  const handleSubmit = async (data: ApplicationFormData) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to apply for jobs",
      });
      router.push("/login");
      return;
    }

    if (!postId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid post ID",
      });
      return;
    }

    try {
    //   const userData = await verifyAuthToken();

    //   if (!userData || !userData.id) {
    //     throw new Error("Failed to retrieve user information");
    //   }

      await createCustomerRequestApplication({
        customerRequestId: postId,
        fee: data.fee,
        // applicantId: userData.id, 
      });

      toast({
        title: "Success",
        description: "Your application has been submitted",
      });

      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error instanceof Error ? error.message : "Failed to submit application"),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fee">Fee (IDR)</Label>
            <Input
              id="fee"
              type="number"
              {...form.register("fee")}
              placeholder="Enter your fee"
            />
            {form.formState.errors.fee && (
              <p className="text-sm text-destructive">
                {form.formState.errors.fee.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
