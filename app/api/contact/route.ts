export const runtime = "nodejs";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: Request): Promise<Response> {
    try {
        const { name, email, message } = await req.json();

        // Email for me...
        await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: "psathul073@gmail.com",
            subject: `New message from ${name}`,
            html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
        });

        // Auto reply to user.
        await resend.emails.send({
            from: "Portfolio D9|Athul <onboarding@resend.dev>",
            to: email,
            subject: "Thanks for contacting me!",
            html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for reaching out! I received your message and will reply soon.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${message}</blockquote>
        <br />
        <p>Best regards,<br/>Athul PS</p>
      `
        });

        return Response.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return Response.json({ success: false }, { status: 500 });
    }
};
