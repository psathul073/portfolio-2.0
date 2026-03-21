"use client";

import { Mail, Phone, Instagram, Linkedin } from "lucide-react";

const getValue = (line: string) => {
  const idx = line.indexOf(":");
  if (idx === -1) return "";
  return line.substring(idx + 1).trim();
};

const ensureHttps = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const FormatMessage = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const lower = line.toLowerCase().trim();

    // EMAIL
    if (lower.includes("email:")) {
      const email = getValue(line);
      if (!email) return null;

      return (
        <div key={index} className="flex items-center gap-2">
          <Mail size={16} />
          <a href={`mailto:${email}`} className="text-blue-500 hover:underline">
            {email}
          </a>
        </div>
      );
    }

    // WHATSAPP / PHONE
    if (lower.includes("whatsapp:") || lower.includes("phone:")) {
      const phone = getValue(line);
      if (!phone) return null;

      return (
        <div key={index} className="flex items-center gap-2">
          <Phone size={16} />
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:underline"
          >
            {phone}
          </a>
        </div>
      );
    }

    // INSTAGRAM
    if (lower.includes("instagram:")) {
      const link = ensureHttps(getValue(line));
      if (!link) return null;

      return (
        <div key={index} className="flex items-center gap-2">
          <Instagram size={16} />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
          >
            Instagram Profile
          </a>
        </div>
      );
    }

    // LINKEDIN
    if (lower.includes("linkedin:")) {
      const link = ensureHttps(getValue(line));
      if (!link) return null;

      return (
        <div key={index} className="flex items-center gap-2">
          <Linkedin size={16} />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline"
          >
            LinkedIn Profile
          </a>
        </div>
      );
    }

    // DEFAULT URL DETECTION (fallback)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

    if (urlRegex.test(line)) {
      return (
        <div key={index}>
          {line.split(urlRegex).map((part, i) =>
            urlRegex.test(part) ? (
              <a
                key={i}
                href={ensureHttps(part)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </div>
      );
    }
    // NORMAL TEXT
    return (
      <p key={index} className="text-sm font-mono font-medium wrap-break-word ">
        {line}
      </p>
    );
  });
};

export default FormatMessage;
