import Image from "next/image";
import Link from "next/link";
import Newsletter from "./Newsletter";
import { assets, counties, categories } from "@/lib/data";

const socials = [
  {
    label: "Facebook",
    path: "M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z",
  },
  {
    label: "Instagram",
    path: "M12 7.4A4.6 4.6 0 1 0 12 16.6 4.6 4.6 0 0 0 12 7.4zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM17.8 5.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.6 1.3 16 1.2C14.3 1.1 9.7 1.1 8 1.2 6.4 1.3 5 1.6 3.8 2.8S2.2 5.5 2.1 7.1C2 8.8 2 13.2 2.1 14.9c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.1.2-7.8z",
  },
  { label: "X", path: "M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" },
  {
    label: "YouTube",
    path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3-5.8 3z",
  },
];

export default function Footer() {
  const footerCategories = ["hiking", "museums", "waterfalls", "state-parks", "breweries", "wineries"]
    .map((s) => categories.find((c) => c.slug === s))
    .filter((c) => c !== undefined);

  return (
    <footer id="contact" className="site-footer">
      <div className="container newsletter-wrap">
        <Newsletter />
      </div>

      <div className="container">
        <div className="footer-cols">
          <div className="col">
            <h3>Counties</h3>
            <ul>
              {counties.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/county-tags/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h3>Capers</h3>
            <ul>
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/county-categories/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h3>Help</h3>
            <ul>
              <li>Live chat</li>
              <li>Help center</li>
              <li>Order status</li>
              <li>Size chart</li>
              <li>Returns &amp; warranty</li>
            </ul>
          </div>
          <div className="col">
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
              {socials.map((s) => (
                <a key={s.label} href="#" aria-label={s.label}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="wordmark">
          <Image src={assets.footerWordmark} alt="County Cappers" fill sizes="(max-width: 1270px) 100vw, 1250px" />
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
