import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { buttonStyles } from "../styles/buttonStyles";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, login } = useAuth();
  const [tab, setTab] = useState("artworks"); // artworks, bids, uploads, home, about
  const [artworks, setArtworks] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ password: "" });

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    auctionEnd: "",
    image: null,
    video: null,
    audio: null
  });

  // Home background form
  const [homeForm, setHomeForm] = useState({
    image: null
  });

  // About intro form
  const [aboutForm, setAboutForm] = useState({
    video: null,
    introText: ""
  });

  // Edit form
  const [editForm, setEditForm] = useState(null);

  // Check login status
  useEffect(() => {
    if (!isAdmin) {
      return; // Show login form
    }
    fetchArtworks();
    if (tab === "bids") {
      fetchBids();
    }
  }, [isAdmin, tab]);

  const fetchArtworks = async () => {
    try {
      const res = await api.get("/art");
      setArtworks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await api.get("/bids");
      setBids(res.data.sort((a, b) => b.amount - a.amount));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginForm.password === "admin123") {
      login("admin-token");
      setMessage({ type: "success", text: "Logged in successfully!" });
      setLoginForm({ password: "" });
    } else {
      setMessage({ type: "error", text: "Invalid password" });
    }
  };

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUploadForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setUploadForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!uploadForm.image) {
      setLoading(false);
      setMessage({ type: "error", text: "Image is required" });
      return;
    }

    const auctionDate = new Date(uploadForm.auctionEnd);
    if (!uploadForm.auctionEnd || Number.isNaN(auctionDate.getTime())) {
      setLoading(false);
      setMessage({ type: "error", text: "Auction end time is invalid" });
      return;
    }

    if (auctionDate <= new Date()) {
      setLoading(false);
      setMessage({ type: "error", text: "Auction end time must be in the future" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("auctionEnd", auctionDate.toISOString());
      if (uploadForm.image) formData.append("image", uploadForm.image);
      if (uploadForm.video) formData.append("video", uploadForm.video);
      if (uploadForm.audio) formData.append("audio", uploadForm.audio);

      await api.post("/art", formData);

      setMessage({ type: "success", text: "Artwork uploaded successfully!" });
      setUploadForm({
        title: "",
        description: "",
        auctionEnd: "",
        image: null,
        video: null,
        audio: null
      });
      fetchArtworks();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      await api.delete(`/art/${id}`);
      setMessage({ type: "success", text: "Artwork deleted successfully!" });
      fetchArtworks();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete artwork" });
    }
  };

  const handleHomeChange = (e) => {
    const { name, files } = e.target;
    if (files) {
      setHomeForm(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleHomeUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!homeForm.image) {
      setLoading(false);
      setMessage({ type: "error", text: "Background image is required" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", homeForm.image);

      await api.post("/home", formData);

      setMessage({ type: "success", text: "Home background uploaded successfully!" });
      setHomeForm({ image: null });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleAboutChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setAboutForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setAboutForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAboutUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!aboutForm.video) {
      setLoading(false);
      setMessage({ type: "error", text: "Intro video is required" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", aboutForm.video);
      if (aboutForm.introText) formData.append("introText", aboutForm.introText);

      await api.post("/about-media", formData);

      setMessage({ type: "success", text: "About intro uploaded successfully!" });
      setAboutForm({ video: null, introText: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900/50 rounded-lg border border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ password: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                placeholder="Enter admin password"
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
              className={buttonStyles.full}
            >
              Login
            </button>
          </form>

          <p className="text-sm opacity-60 mt-6 text-center">
            Demo password: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              navigate("/");
            }}
            className={buttonStyles.secondary}
          >
            Back to Gallery
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setTab("uploads")}
            className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
              tab === "uploads"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upload Artwork
          </button>
          <button
            onClick={() => {
              setTab("artworks");
              fetchArtworks();
            }}
            className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
              tab === "artworks"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Manage Artworks ({artworks.length})
          </button>
          <button
            onClick={() => {
              setTab("bids");
              fetchBids();
            }}
            className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
              tab === "bids"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Bids ({bids.length})
          </button>
          <button
            onClick={() => setTab("home")}
            className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
              tab === "home"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home Background
          </button>
          <button
            onClick={() => setTab("about")}
            className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
              tab === "about"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            About Intro
          </button>
        </div>

        {/* Upload Tab */}
        {tab === "uploads" && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-8">Upload New Artwork</h2>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleUploadChange}
                  required
                  placeholder="Artwork title"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={uploadForm.description}
                  onChange={handleUploadChange}
                  required
                  placeholder="Artwork description"
                  rows="4"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Auction End Time</label>
                <input
                  type="datetime-local"
                  name="auctionEnd"
                  value={uploadForm.auctionEnd}
                  onChange={handleUploadChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="font-semibold mb-4">Media Files</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleUploadChange}
                      accept="image/*"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 file:mr-4 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Background Video (Optional)</label>
                    <input
                      type="file"
                      name="video"
                      onChange={handleUploadChange}
                      accept="video/*"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 file:mr-4 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Background Music (Optional)</label>
                    <input
                      type="file"
                      name="audio"
                      onChange={handleUploadChange}
                      accept="audio/*"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 file:mr-4 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    />
                  </div>
                </div>
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
                {loading ? "Uploading..." : "Upload Artwork"}
              </button>
            </form>
          </div>
        )}

        {/* Artworks Tab */}
        {tab === "artworks" && (
          <div className="space-y-6">
            {artworks.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                No artworks uploaded yet.
              </div>
            ) : (
              artworks.map(art => (
                <div
                  key={art._id}
                  className="bg-gray-900/50 rounded-lg border border-gray-700 p-6 flex gap-6 items-start"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{art.title}</h3>
                    <p className="text-gray-400 mb-4">{art.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="opacity-60">Auction Ends</span>
                        <div className="font-semibold">
                          {new Date(art.auctionEnd).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="opacity-60">Created</span>
                        <div className="font-semibold">
                          {new Date(art.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(art._id)}
                      className={buttonStyles.danger}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bids Tab */}
        {tab === "bids" && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            {bids.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                No bids yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Email</th>
                      <th className="px-6 py-4 text-left font-semibold">Amount</th>
                      <th className="px-6 py-4 text-left font-semibold">Artwork</th>
                      <th className="px-6 py-4 text-left font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <tr key={bid._id} className="border-b border-gray-700 hover:bg-gray-800/50">
                        <td className="px-6 py-4">{bid.email}</td>
                        <td className="px-6 py-4 font-bold text-green-400">
                          ${Number(bid.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm opacity-70">
                          {bid.art?.title || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-sm opacity-70">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Home Background Tab */}
        {tab === "home" && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-8">Upload Home Background</h2>

            <form onSubmit={handleHomeUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleHomeChange}
                  accept="image/*"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 file:mr-4 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                />
              </div>

              {message && tab === "home" && (
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
                {loading ? "Uploading..." : "Upload Background"}
              </button>
            </form>
          </div>
        )}

        {/* About Intro Tab */}
        {tab === "about" && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-8">Upload About Intro Video</h2>

            <form onSubmit={handleAboutUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Intro Video</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleAboutChange}
                  accept="video/*"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 file:mr-4 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Intro Text (Optional)</label>
                <textarea
                  name="introText"
                  value={aboutForm.introText}
                  onChange={handleAboutChange}
                  placeholder="Brief introduction text"
                  rows="4"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition resize-none"
                />
              </div>

              {message && tab === "about" && (
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
                {loading ? "Uploading..." : "Upload Intro"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
