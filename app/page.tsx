import Script from "next/script";
import { portfolioMarkup } from "@/features/portfolio/content";

export default function Home() {
  return (
    <>
      <div className="portfolio-root" dangerouslySetInnerHTML={{ __html: portfolioMarkup }} />
      <Script src="/portfolio.js" strategy="afterInteractive" />
      <Script src="/github-activity.js" strategy="afterInteractive" />
    </>
  );
}
