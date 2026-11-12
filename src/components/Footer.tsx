import Image from "next/image";
import Link from "next/link";
import Newsletter from "./Newsletter";
import { assets, counties, categories } from "@/lib/data";

export default function Footer() {
  const footerCategories = ["hiking", "museums", "waterfalls", "state-parks", "breweries", "wineries"]
    .map((s) => categories.find((c) => c.slug === s))
    .filter((c) => c !== undefined);

  return (
    <footer id="contact">
      <div className="container" style={{ paddingTop: 60 }}>
        <Newsletter />

        <div className="footer-cols">
          <div className="card">
            <h3>Counties</h3>
            <ul>
              {counties.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/county-tags/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/county-tags/">View all →</Link>
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>Capers</h3>
            <ul>
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/county-categories/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Help</h3>
            <ul>
              <li>Live chat</li>
              <li>Help center</li>
              <li>Order status</li>
              <li>Size chart</li>
              <li>Returns &amp; warranty</li>
            </ul>
          </div>
          <div className="card">
            <h3>Get in touch</h3>
            <ul>
              <li>
                <a href="mailto:support@example.com">support@example.com</a>
              </li>
            </ul>
            <div className="phone">+ (406) 555-0120</div>
            <ul>
              <li>2972 Westheimer Rd. Santa Ana, Illinois, USA</li>
            </ul>
            <div className="socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">ig</a>
              <a href="#" aria-label="X">X</a>
              <a href="#" aria-label="YouTube">▶</a>
            </div>
          </div>
        </div>

        <div className="wordmark">
          <Image src={encodeURI(assets.footerWordmark)} alt="County Cappers" fill sizes="(max-width: 1240px) 100vw, 1240px" />
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container inner">
          <div>
            Copyright © {new Date().getFullYear()} <b>county cappers.</b> All rights reserved
          </div>
          <div className="links">
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Cookies</a>
            <a href="#">Privacy Policy</a>
            <div>
              <b>designed &amp; developed by design orient agency</b>
            </div>
          </div>
          <div className="pay">
            We Accept
            <Image src={assets.payment} alt="Visa, Mastercard, Amex, Discover, Pay" width={228} height={28} />
          </div>
        </div>
      </div>
    </footer>
  );
}
