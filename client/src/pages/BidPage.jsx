import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import { buttonStyles, inputStyles } from "../styles/buttonStyles";

export default function BidPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [art, setArt] = useState(null);

  useEffect(() => {
    api.get(`/art/${id}`)
      .then(res => setArt(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!form.email || !form.amount) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      setLoading(false);
      return;
    }

    if (parseFloat(form.amount) <= 0) {
      setMessage({ type: "error", text: "Bid amount must be greater than 0" });
      setLoading(false);
      return;
    }

    try {
      await api.post(`/bids/${id}`, {
        email: form.email,
        amount: parseFloat(form.amount)
      });

      setMessage({
        type: "success",
        text: "Bid submitted successfully! Thank you for your participation."
      });
      setForm({ email: "", amount: "" });

      setTimeout(() => {
        navigate("/gallery");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to submit bid. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20">
      <div className="max-w-2xl mx-auto px-6 md:px-16 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/art/${id}`)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-12 font-medium"
        >
          ← Back to Artwork
        </button>

        {/* Artwork Info Card */}
        {art && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-6 mb-8 flex gap-6">
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{art.title}</h3>
              <p className="opacity-70">{art.description}</p>
            </div>
          </div>
        )}

        {/* Bid Form */}
        <form onSubmit={submit} className="bg-gray-900/50 rounded-lg border border-gray-700 p-8">
          <h2 className="text-3xl font-bold mb-8">Place Your Bid</h2>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={inputStyles}
              />
              <p className="text-xs opacity-60 mt-2">We'll contact you if you win the auction</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Bid Amount ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400">$</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className={inputStyles + " pl-8"}
                />
              </div>
              <p className="text-xs opacity-60 mt-2">Enter your maximum bid amount</p>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-4 rounded-lg mb-8 border ${
              message.type === "success"
                ? "bg-green-900/30 border-green-500 text-green-200"
                : "bg-red-900/30 border-red-500 text-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={buttonStyles.large + " w-full transform hover:scale-105 disabled:scale-100"}
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>

          {/* Terms */}
          <p className="text-xs opacity-50 text-center mt-6">
            By submitting a bid, you agree to our auction terms and conditions.
            Highest bid wins the artwork.
          </p>
        </form>
      </div>
    </div>
  );
}
