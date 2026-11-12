import Link from "next/link";
import { PageHero } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" image={null}>
        <p>The page you’re looking for doesn’t exist or has moved.</p>
      </PageHero>
      <div className="container center" style={{ padding: "40px 16px" }}>
        <Link href="/county-tags/" className="btn btn-green">Browse counties</Link>
      </div>
    </>
  );
}
