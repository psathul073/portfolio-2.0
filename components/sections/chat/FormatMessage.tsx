"use client";

import { Mail, Phone, Instagram, Linkedin } from "lucide-react";

// Matching patterns.
const extract = (text: string) => {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = text.match(/\d{10}/)?.[0];
  const instagram = text.match(/instagram\.com\/[^\s,]+/i)?.[0];
  const linkedin = text.match(/linkedin\.com\/[^\s,]+/i)?.[0];

  return { email, phone, instagram, linkedin };
};

export default function FormatMessage({ text }: { text: string }) {
  const { email, phone, instagram, linkedin } = extract(text);

  // If it's NOT a contact message set as normal text.
  if (!email && !phone && !instagram && !linkedin) {
    return <p className="text-sm wrap-break-word font-mono">{text}</p>;
  }

  return (
    <div className="space-y-2 text-sm">
      <p>You can contact Athul via 👇</p>
      {/* EMAIL */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition "
        >
          <Mail size={18} />
          <span className="break-all">{email}</span>
        </a>
      )}

      {/* PHONE */}
      {phone && (
        <a
          href={`https://wa.me/${phone}`}
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-green-100 hover:text-green-600 transition"
        >
          <Phone size={18} className="" />
          <span className=" ">{phone}</span>
        </a>
      )}

      {/* INSTAGRAM */}
      {instagram && (
        <a
          href={`https://${instagram}`}
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-100 transition"
        >
          <Instagram size={18} />
          <span>Instagram</span>
        </a>
      )}

      {/* LINKEDIN */}
      {linkedin && (
        <a
          href={`https://${linkedin}`}
          target="_blank"
          className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition"
        >
          <Linkedin size={18} />
          <span>LinkedIn</span>
        </a>
      )}
    </div>
  );
}
