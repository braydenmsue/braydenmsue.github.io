import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    order: z.number().default(999),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(), // path under public/, e.g. "images/projects/foo.png"
    repo_url: z.url().optional(),
    live_url: z.url().optional(),
    challenges: z
      .array(z.object({ challenge: z.string(), solution: z.string() }))
      .default([]),
  }),
});

export const collections = { posts, projects };
