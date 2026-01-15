import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingBar } from "@/components/ui/spinner"
import { useCardCreation } from "@/lib/hooks/useCardCreation"
import { getFieldError } from "@/lib/utils/validation"

function Admin() {
  const {
    formState,
    validation,
    handleInputChange,
    handleSubmit
  } = useCardCreation()

  return (
    <>
      <LoadingBar isLoading={formState.isSubmitting} />
      <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin - Create New Card</h1>
        <p className="text-muted-foreground">Enter a unique card ID and task description to create a new card.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Card</CardTitle>
          <CardDescription>
            Enter a unique card ID and task description to create a new card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>
                  <Label htmlFor="customId">Card ID *</Label>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="customId"
                    name="customId"
                    value={formState.customId}
                    onChange={handleInputChange}
                    placeholder="e.g., 123"
                    aria-invalid={!!getFieldError(validation.errors, 'Card ID')}
                  />
                  {getFieldError(validation.errors, 'Card ID') && (
                    <FieldError>{getFieldError(validation.errors, 'Card ID')}</FieldError>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <Label htmlFor="task">Task *</Label>
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="task"
                    name="task"
                    value={formState.task}
                    onChange={handleInputChange}
                    placeholder="Enter the task description for this card"
                    rows={4}
                    aria-invalid={!!getFieldError(validation.errors, 'Task')}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Creating..." : "Create Card"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {formState.success && formState.generatedUrl && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
            Card created successfully!
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mb-2">
            Share this edit URL with users:
          </p>
          <div className="bg-white dark:bg-gray-800 p-3 rounded border text-xs font-mono break-all">
            {formState.generatedUrl}
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default Admin

