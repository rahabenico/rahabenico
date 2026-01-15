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

  return (
    <>
      <LoadingBar isLoading={formState.isSubmitting} />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-bold font-headline text-3xl">Create New Card</h1>
          <p className="text-muted-foreground">Enter a unique card ID and task description to create a new card.</p>
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
          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p className="mb-1 font-medium text-green-800 text-sm dark:text-green-200">Card created successfully!</p>
            <p className="mb-2 text-green-600 text-xs dark:text-green-400">Share this edit URL with users:</p>
            <div className="break-all rounded border bg-white p-3 font-mono text-xs dark:bg-gray-800">
              {formState.generatedUrl}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminView;
