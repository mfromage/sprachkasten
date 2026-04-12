import { notFound } from "next/navigation";
import { getArticle, getArticleSlugs } from "@/lib/fixtures";
import { ArticleView } from "@/components/klartext/ArticleView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function KlartextPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return <ArticleView article={article} />;
}
