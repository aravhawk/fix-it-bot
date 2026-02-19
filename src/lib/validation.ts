import { z } from "zod"

export const bugReportSchema = z.object({
  repoUrl: z
    .string()
    .min(1, "Repository URL is required")
    .refine((val) => {
      // Allow full github.com/user/repo or user/repo
      return (
        /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+/.test(val) ||
        /^[\w-]+\/[\w-]+$/.test(val)
      );
    }, "Must be a valid GitHub repository (e.g., 'user/repo' or 'github.com/user/repo')"),
  branchSha: z.string().min(1, "Branch name or commit SHA is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  language: z.string().optional(),
})

export type BugReportValues = z.infer<typeof bugReportSchema>
