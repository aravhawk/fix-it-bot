import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Terminal, CheckCircle2, AlertCircle, GitBranch, Github, AlertTriangle, LifeBuoy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Label } from "./ui/label"
import { bugReportSchema, type BugReportValues } from "../lib/validation"
import { cn } from "../lib/utils"
import { submitToKilo } from "../lib/webhook"
import type { FixItBotConfig, FixItBotLabels, FixItBotCallbacks } from "../lib/types"

interface BugReportFormProps {
  config: FixItBotConfig
  labels?: FixItBotLabels
  callbacks?: FixItBotCallbacks
}

export function BugReportForm({ config, labels, callbacks }: BugReportFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successData, setSuccessData] = React.useState<{ prUrl?: string } | null>(null)

  const defaultRepo = config.repoUrl
  const defaultBranch = config.defaultBranch || "main"
  const isSupportMode = !!defaultRepo

  const form = useForm<BugReportValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      repoUrl: defaultRepo || "",
      branchSha: defaultBranch,
      description: "",
      priority: "medium",
      language: config.defaultLanguage || "typescript",
    },
  })

  async function onSubmit(data: BugReportValues) {
    setIsSubmitting(true)
    callbacks?.onSubmit?.(data)

    try {
      const result = await submitToKilo(data, config)

      if (result.success) {
        const prUrl = result.prUrl || result.data?.prUrl as string || `https://github.com/${(data.repoUrl || defaultRepo || "").replace("https://github.com/", "")}/pull/new`
        setSuccessData({ prUrl })
        toast.success(labels?.successDescription || "Report received! Agent deployed to fix it.")
        callbacks?.onSuccess?.({ success: true, data: result.data, prUrl })
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error("Submit error:", err)
      toast.error(err.message || "Failed to submit bug report. Please try again.")
      callbacks?.onError?.(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSuccessData(null)
    form.reset({
      repoUrl: defaultRepo || "",
      branchSha: defaultBranch,
      description: "",
      priority: "medium",
    })
  }

  if (successData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto border-primary/50 shadow-[0_0_30px_rgba(251,191,36,0.1)] bg-card/50 backdrop-blur-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 border border-primary/50">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {labels?.successTitle || "Fix In Progress"}
            </CardTitle>
            <CardDescription className="text-lg">
              {labels?.successDescription || "AI Agent has engaged and is working on a fix."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="rounded-md bg-secondary/50 p-6 border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">Monitor Status</p>
              {successData.prUrl && (
                <a
                  href={successData.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-mono text-primary hover:underline break-all"
                >
                  View Pull Request
                </a>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button onClick={resetForm} variant="outline" className="min-w-[200px]">
              {labels?.newIssueButton || "Submit New Issue"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 bg-card/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        {isSupportMode ? <LifeBuoy className="w-24 h-24" /> : <Terminal className="w-24 h-24" />}
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary">
              {labels?.title || (isSupportMode ? "Support Portal" : "Fix_It_Bot")}
            </span>
            {!labels?.title && !isSupportMode && <span className="text-muted-foreground text-lg font-normal">v1.0</span>}
          </CardTitle>
        </div>
        <CardDescription className="text-base">
          {labels?.description || (isSupportMode
            ? "Report a bug or request a feature. Our AI agents will attempt to implement it automatically."
            : "Initialize automated repair sequence. Deploy Kilo Agents to your repository."
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!isSupportMode && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Repository URL */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="repoUrl" className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-primary" /> Repository
                </Label>
                <div className="relative group">
                  <Input
                    id="repoUrl"
                    placeholder="github.com/username/repo"
                    className={cn(
                      "pl-10 font-mono transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(251,191,36,0.1)]",
                      form.formState.errors.repoUrl && "border-destructive focus:border-destructive"
                    )}
                    {...form.register("repoUrl")}
                  />
                  <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <span className="text-xs">GIT</span>
                  </div>
                </div>
                {form.formState.errors.repoUrl && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {form.formState.errors.repoUrl.message}
                  </p>
                )}
              </div>

              {/* Branch / SHA */}
              <div className="space-y-2">
                <Label htmlFor="branchSha" className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" /> Branch / SHA
                </Label>
                <Input
                  id="branchSha"
                  placeholder="main"
                  className="font-mono"
                  {...form.register("branchSha")}
                />
                {form.formState.errors.branchSha && (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.branchSha.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" /> Priority
              </Label>
              <Select
                onValueChange={(val) => form.setValue("priority", val as BugReportValues["priority"])}
                defaultValue={form.getValues("priority")}
              >
                <SelectTrigger className={cn(
                  "font-mono uppercase",
                  form.watch("priority") === "critical" && "text-destructive border-destructive/50 bg-destructive/5"
                )}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical" className="text-destructive focus:text-destructive">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">
                {labels?.descriptionLabel || (isSupportMode ? "Describe the issue or feature request" : "Mission Briefing (Bug Description)")}
              </Label>
              <Textarea
                id="description"
                placeholder={labels?.descriptionPlaceholder || (isSupportMode
                  ? "I found a bug on the pricing page..."
                  : "Describe the anomaly, reproduction steps, and expected outcome...")}
                className="min-h-[150px] font-mono text-sm leading-relaxed"
                {...form.register("description")}
              />
               {form.formState.errors.description && (
                <p className="text-destructive text-xs mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold tracking-wider relative overflow-hidden group"
            disabled={isSubmitting}
            variant="default"
          >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> {labels?.submittingButton || (isSupportMode ? "SUBMITTING..." : "ESTABLISHING UPLINK...")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {labels?.submitButton || (isSupportMode ? "SUBMIT REPORT" : "INITIATE REPAIR")} <Terminal className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
