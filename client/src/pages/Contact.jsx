import { useState } from "react";
import api from "../api";
import { buttonStyles, inputStyles } from "../styles/buttonStyles";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/contact", form);
      setMessage({ type: "success", text: "Message sent successfully! We'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center">Get In Touch</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="opacity-70 text-lg mb-6">
                Have questions about our auctions or need assistance? Reach out to us.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Email</h4>
                <a href="mailto:contact@artauction.com" className="text-blue-400 hover:text-blue-300 transition">
                  contact@artauction.com
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hours</h4>
                <p className="opacity-70">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="opacity-70">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Response</h4>
                <p className="opacity-70">We typically respond within 24 hours.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputStyles}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputStyles}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className={inputStyles + " resize-none"}
                placeholder="Your message..."
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === "success" 
                  ? "bg-green-900/30 border border-green-500 text-green-200" 
                  : "bg-red-900/30 border border-red-500 text-red-200"
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={buttonStyles.full}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
