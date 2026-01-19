import { DownloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card/card";
import { CardContent } from "@/components/ui/card/card-content";
import { CardDescription } from "@/components/ui/card/card-description";
import { CardHeader } from "@/components/ui/card/card-header";
import { CardTitle } from "@/components/ui/card/card-title";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBar } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCardCreation } from "@/lib/hooks/useCardCreation";
import { getFieldError } from "@/lib/utils/validation";

function AdminView() {
  const { formState, validation, handleInputChange, handleSubmit } = useCardCreation();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = async () => {
    if (formState.generatedUrl) {
      try {
        await navigator.clipboard.writeText(formState.generatedUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  const handleDownloadQR = () => {
    if (formState.generatedUrl) {
      // Create a temporary canvas to convert SVG to PNG
      const svg = document.querySelector(".qr-code-svg") as SVGElement;
      if (svg) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          // Create download link
          const link = document.createElement("a");
          link.download = `${formState.customId || "card"}.png`;
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          URL.revokeObjectURL(svgUrl);
        };

        img.src = svgUrl;
      }
    }
  };

  return (
    <>
      <LoadingBar isLoading={formState.isSubmitting} />
      <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="mb-2 font-bold font-headline text-3xl">Create New Card</h1>
          <p className="text-md">Enter a unique card ID and task description to create a new card.</p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Create New Card</CardTitle>
            <CardDescription>Enter a unique card ID and task description to create a new card.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>
                    <Label htmlFor="customId">Card name</Label>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="customId"
                      name="customId"
                      value={formState.customId}
                      onChange={handleInputChange}
                      placeholder="e.g., 123"
                      aria-invalid={!!getFieldError(validation.errors, "Card ID")}
                    />
                    {getFieldError(validation.errors, "Card ID") && (
                      <FieldError>{getFieldError(validation.errors, "Card ID")}</FieldError>
                    )}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    <Label htmlFor="task">Task</Label>
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="task"
                      name="task"
                      value={formState.task}
                      onChange={handleInputChange}
                      placeholder="Enter the task description for this card"
                      rows={4}
                      aria-invalid={!!getFieldError(validation.errors, "Task")}
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>

              <div className="mt-6 flex justify-end gap-2">
                <Button type="submit" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? "Creating..." : "Create Card"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {formState.success && formState.generatedUrl && (
          <div className="mt-6 rounded-xl border border-green-700/20 bg-green-50 px-6 pt-5 pb-6 dark:border-green-800 dark:bg-green-900/20">
            <p className="mb-3 font-semibold text-base">Card created successfully!</p>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex-1 break-all rounded-lg border border-green-700/20 bg-white p-4 font-mono text-gray-900 text-xs dark:border-green-700 dark:bg-gray-800 dark:text-gray-100">
                {formState.generatedUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="shrink-0"
                title="Copy URL to clipboard"
              >
                <HugeiconsIcon icon={DownloadIcon} className="h-4 w-4" />
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="flex flex-col items-center gap-4">
              {/* biome-ignore lint/nursery/useSortedClasses: Complex dark mode classes */}
              <div className="bg-white border border-green-700/20 p-4 rounded-lg dark:bg-gray-800 dark:border-green-700">
                <QRCode
                  value={formState.generatedUrl}
                  size={200}
                  className="qr-code-svg"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <Button variant="outline" onClick={handleDownloadQR} className="w-fit" title="Download QR code as PNG">
                <HugeiconsIcon icon={DownloadIcon} className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminView;
