// ---------------------------------------------------------------------------
// Site configuration — edit these to personalise your portfolio
// ---------------------------------------------------------------------------
export const NAME = "Brayden Sue";
export const TITLE = "Lorem Ipsum";
export const BIO =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const SOCIAL_LINKS: { github?: string; linkedin?: string; email?: string } = {
  github: "https://github.com/braydenmsue",
  linkedin: undefined, // e.g. "https://linkedin.com/in/yourhandle"
  email: undefined, // e.g. "you@example.com"
};

// Free access key from https://web3forms.com (it's safe to publish — it only
// allows sending messages to your inbox). Until it's set, the contact page
// shows a placeholder instead of the form.
export const WEB3FORMS_ACCESS_KEY: string | undefined = undefined;

// Projects live in content/projects/*.md — see sample-project.md for the format.
// Blog posts live in content/posts/*.md.

export const EXPERIENCE: { role: string; company: string; dates: string; points?: string[] }[] = [
  {
    role: "Lorem Ipsum",
    company: "Dolor Sit Amet",
    dates: "Jan 2025 – Present",
    points: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore.",
    ],
  },
];

export const EDUCATION: { degree: string; school: string; dates: string }[] = [
  {
    degree: "Lorem Ipsum Dolor",
    school: "Consectetur University",
    dates: "Sep 2020 – Apr 2024",
  },
];

export const SKILLS: string[] = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"];

// Drop your resume at public/resume.pdf and a download button appears.
export const RESUME_FILE = "resume.pdf";
