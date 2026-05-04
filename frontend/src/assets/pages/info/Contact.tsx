import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.email().trim().min(1, { message: "Email is required" }),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(2000, { message: "Message must be 2000 characters or fewer" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as keyof ContactFormData;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        subject: fieldErrors.subject?.[0],
        message: fieldErrors.message?.[0],
      });

      return;
    }

    setErrors({});

    // Show success message
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-8 py-10 lg:px-12">
        <section className="border-2 border-gold-neutral bg-neutral px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gold-neutral">Contact</h1>
              <p className="mt-1 text-sm text-text-neutral">
                A minimal way to reach the team.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="border-2 border-gold-neutral bg-neutral p-4">
              <h3 className="text-sm font-semibold text-gold-neutral">Email</h3>
              <p className="mt-2 text-sm text-text-neutral">
                <a
                  href="mailto:info@fabularium.dev"
                  className="text-gold-neutral hover:text-gold-light"
                >
                  info@fabularium.dev
                </a>
              </p>
            </div>

            <div className="border-2 border-gold-neutral bg-neutral p-4">
              <h3 className="text-sm font-semibold text-gold-neutral">
                Location
              </h3>
              <p className="mt-2 text-sm text-text-neutral">
                University of Gdansk — Poland
              </p>
            </div>

            <div className="border-2 border-gold-neutral bg-neutral p-4">
              <h3 className="text-sm font-semibold text-gold-neutral">
                Community
              </h3>
              <p className="mt-2 text-sm text-text-neutral">Discord • GitHub</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="border-2 border-gold-neutral bg-neutral p-6"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full bg-dark text-text-neutral border border-gold-neutral px-3 py-2"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-error">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full bg-dark text-text-neutral border border-gold-neutral px-3 py-2"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-error">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full bg-dark text-text-neutral border border-gold-neutral px-3 py-2"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-error">{errors.subject}</p>
                )}
              </div>

              <div className="mb-4">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Message"
                  className="w-full bg-dark text-text-neutral border border-gold-neutral px-3 py-2"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-error">{errors.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 border border-gold-neutral hover:bg-gold-neutral cursor-pointer"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    });
                    setErrors({});
                    setSubmitted(false);
                  }}
                  className="px-4 py-2 border border-gold-neutral text-text-neutral hover:bg-gold-neutral cursor-pointer"
                >
                  Clear
                </button>
              </div>

              {submitted && (
                <div className="mt-4 text-sm text-success">
                  Thank you — we'll be in touch shortly.
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contact;
