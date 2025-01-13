import { ok, err, isErr, type Result } from "@jimfilippou/rerust";

type Post = { title: string; slug: string };
type ApiResponse = { data: Post[] };

const getLatestPosts = async (): Promise<Result<string>> => {
  const res = await fetch("https://jimfilippou.com/api/articles");
  if (!res.ok) return err(`Failed to fetch posts: ${res.statusText}`);
  const { data: posts }: ApiResponse = await res.json();
  return ok(
    posts
      .map((p) => `- [${p.title}](https://jimfilippou.com/articles/${p.slug})`)
      .join("\n")
  );
};

const file = "./README.md";
const readme = await Bun.file(file).text();
const parts = readme.split("#### My latest posts:");

if (parts.length !== 2) {
  console.error("Could not find latest posts section");
  process.exit(1);
}

const posts = await getLatestPosts();
if (isErr(posts)) {
  console.error(posts.value);
  process.exit(1);
}

await Bun.write(
  file,
  parts[0] + "#### My latest posts:\n\n" + posts.value + "\n"
);
