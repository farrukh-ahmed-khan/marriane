"use client";

import Image from "next/image";
import { useState } from "react";
import { assets } from "@/lib/data";

export default function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <div className="newsletter">
      <Image src={assets.newsletterBg} alt="" fill sizes="(max-width: 1240px) 100vw, 1240px" className="bg" />
      <h2>Newsletter signup</h2>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: connect to your email provider (Mailchimp, Brevo, etc.)
            setDone(true);
            e.currentTarget.reset();
          }}
        >
          <input type="email" name="email" required placeholder="Enter your email address" aria-label="Email address" />
          <button type="submit">Subscribe ↗</button>
        </form>
        {done && <p className="msg">Thanks for subscribing!</p>}
      </div>
    </div>
  );
}
