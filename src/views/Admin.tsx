import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

function Admin() {
  const navigate = useNavigate()
  const createCard = useMutation(api.cardEntries.createCard)
  
  const [customId, setCustomId] = useState("")
  const [task, setTask] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!customId.trim()) {
      setError("Card ID is required")
      return
    }

    if (!task.trim()) {
      setError("Task is required")
      return
    }

    setIsSubmitting(true)

    try {
      await createCard({
        customId: customId.trim(),
        task: task.trim(),
      })
      
      setSuccess(true)
      const createdId = customId.trim()
      setCustomId("")
      setTask("")
      
      // Optionally navigate to the new card
      setTimeout(() => {
        navigate(`/card/${createdId}`)
      }, 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create card"
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    placeholder="e.g., 123"
                    aria-invalid={!!error}
                  />
                  {error && <FieldError>{error}</FieldError>}
                  {success && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Card created successfully! Redirecting...
                    </p>
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
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter the task description for this card"
                    rows={4}
                    aria-invalid={!!error}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Card"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Admin

