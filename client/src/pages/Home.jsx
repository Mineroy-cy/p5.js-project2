import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { buttonStyles } from "../styles/buttonStyles";

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [homeMedia, setHomeMedia] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/art"),
      api.get("/home")
    ])
      .then(([artRes, homeRes]) => {
        setArtworks(artRes.data.slice(0, 6));
        setHomeMedia(homeRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (artworks.length === 0) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % artworks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [artworks]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white pt-20">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const featured = artworks[featuredIndex];
  const bgImage = homeMedia?.backgroundImageUrl;

  return (
    <div 
      className="min-h-screen text-white pt-20"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ top: 0 }}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Digital Art <span className="text-blue-400">Auctions</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover exclusive interactive artworks with immersive video backgrounds and live bidding.
            </p>
            <Link
              to="/gallery"
              className={buttonStyles.large}
            >
              Explore Gallery
            </Link>
          </div>

          {/* Featured Artwork Carousel */}
          {featured && (
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-96 object-cover rounded-lg shadow-2xl hover:shadow-3xl transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold mb-2">{featured.title}</h3>
                  <p className="opacity-80 text-sm mb-4 line-clamp-2">{featured.description}</p>
                  <Link
                    to={`/art/${featured._id}`}
                    className={buttonStyles.small + " w-fit"}
                  >
                    View Details
                  </Link>
                </div>
                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {artworks.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFeaturedIndex(idx)}
                      className={`h-2 rounded-full transition ${
                        idx === featuredIndex ? "bg-blue-400 w-8" : "bg-gray-500 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured Artworks Grid */}
        <div className="px-6 md:px-16 py-20">
          <h2 className="text-4xl font-bold mb-12">Current Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => (
              <Link
                key={art._id}
                to={`/art/${art._id}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6 group-hover:from-black">
                  <h3 className="text-xl font-bold mb-2">{art.title}</h3>
                  <p className="opacity-80 text-sm mb-4 line-clamp-2">{art.description}</p>
                  <div className="text-sm text-blue-400">View Auction →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 px-6 md:px-16 py-16 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Art Community</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Participate in live auctions, support digital artists, and own exclusive interactive artwork.
          </p>
          <Link
            to="/gallery"
            className={buttonStyles.large + " bg-white text-blue-900 hover:bg-gray-100 font-semibold"}
          >
            Start Bidding Now
          </Link>
        </div>
      </div>
    </div>
  );
}
