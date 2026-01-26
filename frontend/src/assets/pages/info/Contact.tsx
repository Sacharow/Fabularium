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
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Back Button */}
      <div className="pt-6 px-6 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-500 underline mb-6"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-xl text-gray-300">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">Email</h3>
                <p className="text-gray-300 break-all">
                  <a href="mailto:info@fabularium.dev" className="hover:text-orange-500">
                    info@fabularium.dev
                  </a>
                </p>
              </div>

              {/* Office */}
              <div className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">Location</h3>
                <p className="text-gray-300">
                  Faculty of Mathematics, Physics and Informatics<br />
                  University of Gdansk<br />
                  Poland
                </p>
              </div>

              {/* Social */}
              <div className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">Follow Us</h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <a href="#" className="text-orange-500 hover:text-orange-400">
                      Discord Community
                    </a>
                  </p>
                  <p className="text-gray-300">
                    <a href="#" className="text-orange-500 hover:text-orange-400">
                      GitHub
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 border border-orange-700/30">
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-600"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-600"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-600"
                  placeholder="What is this about?"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-600"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Send Message
              </button>

              {submitted && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded text-green-300">
                  ✓ Thank you! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="py-8"></div>
    </div>
  );
}

export default Contact;
