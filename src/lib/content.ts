import { getCollection } from "astro:content";

export async function getSortedPosts() {
  const posts = await getCollection("posts");
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getSortedProjects() {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/** YYYY-MM-DD, matching how dates are written in frontmatter. */
export const formatDate = (d: Date) => d.toISOString().slice(0, 10);
