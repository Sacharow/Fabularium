import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill out all fields");
      return;
    }

    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    
    // Show success message
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-300 hover:text-yellow-200 underline mb-6 text-sm"
        >
          ← Back
        </button>

        {/* Header Card */}
        <div className="bg-orange-950/80 border-2 rounded-xl py-8 px-10 border-orange-900 shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-sm text-gray-300">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-4">
            {/* Email */}
            <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Email</h3>
              <p className="text-gray-300 text-sm break-all">
                <a href="mailto:info@fabularium.dev" className="hover:text-yellow-200">
                  info@fabularium.dev
                </a>
              </p>
            </div>

            {/* Office */}
            <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Location</h3>
              <p className="text-gray-300 text-sm">
                Faculty of Mathematics, Physics and Informatics<br />
                University of Gdansk<br />
                Poland
              </p>
            </div>

            {/* Social */}
            <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Follow Us</h3>
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">
                  <a href="#" className="text-yellow-300 hover:text-yellow-200">
                    Discord Community
                  </a>
                </p>
                <p className="text-gray-300 text-sm">
                  <a href="#" className="text-yellow-300 hover:text-yellow-200">
                    GitHub
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-orange-950/60 border border-orange-900 rounded-lg p-6 shadow-md">
              <div className="mb-4">
                <label className="block text-gray-200 font-semibold text-sm mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-orange-900 rounded py-2 px-3 bg-black/70 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-200 font-semibold text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-orange-900 rounded py-2 px-3 bg-black/70 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-200 font-semibold text-sm mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-orange-900 rounded py-2 px-3 bg-black/70 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                  placeholder="What is this about?"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-200 font-semibold text-sm mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-orange-900 rounded py-2 px-3 bg-black/70 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-yellow-300 text-black font-bold py-2 px-4 rounded hover:scale-105 hover:bg-yellow-400 transition duration-300"
              >
                Send Message
              </button>

              {submitted && (
                <div className="mt-4 p-3 bg-orange-900/40 border border-orange-700 rounded text-yellow-200 text-sm">
                  ✓ Thank you! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
