type Post = { title: string; slug: string };
type ApiResponse = { data: Post[] };

const getLatestPosts = async (): Promise<string> => {
  const res = await fetch("https://jimfilippou.com/api/articles");
  const { data: posts }: ApiResponse = await res.json();
  return posts
    .map((p) => `- [${p.title}](https://jimfilippou.com/articles/${p.slug})`)
    .join("\n");
};

const file = "./README.md";
const readme = await Bun.file(file).text();
const parts = readme.split("#### My latest posts:");
const posts = await getLatestPosts();

await Bun.write(file, parts[0] + "#### My latest posts:\n\n" + posts + "\n");

export {};
