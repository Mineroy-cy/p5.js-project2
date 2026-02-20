import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { buttonStyles } from "../styles/buttonStyles";

export default function ArtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/art/${id}`)
      .then(res => {
        setArt(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!art?.auctionEnd) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const auctionEnd = new Date(art.auctionEnd);
      
      // Check if auctionEnd is valid
      if (isNaN(auctionEnd.getTime())) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
        return;
      }
      
      const diff = auctionEnd - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ 
        days: Math.max(0, days), 
        hours: Math.max(0, hours), 
        minutes: Math.max(0, minutes), 
        seconds: Math.max(0, seconds), 
        ended: false 
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [art?.auctionEnd]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white pt-20">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!art) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Artwork Not Found</h1>
          <button
            onClick={() => navigate("/gallery")}
            className={buttonStyles.primary}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/gallery")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-12 font-medium"
        >
          ← Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Artwork Image */}
          <div className="lg:col-span-2">
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-auto rounded-lg shadow-2xl border border-gray-700"
            />
          </div>

          {/* Artwork Details */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{art.title}</h1>
              <p className="text-gray-300 text-lg">{art.description}</p>
            </div>

            {/* Auction Timer */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Time Remaining</h3>
              {timeRemaining.ended || !art?.auctionEnd ? (
                <div className="text-red-400 text-xl font-bold">Auction Ended</div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{timeRemaining.days ?? 0}</div>
                    <div className="text-xs opacity-70 mt-2">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{timeRemaining.hours ?? 0}</div>
                    <div className="text-xs opacity-70 mt-2">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{timeRemaining.minutes ?? 0}</div>
                    <div className="text-xs opacity-70 mt-2">Mins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{timeRemaining.seconds ?? 0}</div>
                    <div className="text-xs opacity-70 mt-2">Secs</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bid Button */}
            <button
              onClick={() => navigate(`/bid/${id}`)}
              disabled={timeRemaining.ended || !art?.auctionEnd}
              className={buttonStyles.large + " w-full transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"}
            >
              {timeRemaining.ended || !art?.auctionEnd ? "Auction Closed" : "Place a Bid"}
            </button>

            {/* Additional Info */}
            <div className="space-y-4 bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between">
                <span className="opacity-70">Artwork ID</span>
                <span className="font-mono text-sm">{art._id?.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Status</span>
                <span className={timeRemaining.ended ? "text-red-400" : "text-green-400"}>
                  {timeRemaining.ended ? "Closed" : "Active"}
                </span>
              </div>
              {art.auctionEnd && (
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Ends on</span>
                  <span>{new Date(art.auctionEnd).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
