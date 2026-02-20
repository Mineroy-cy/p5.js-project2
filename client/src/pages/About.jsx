import { useEffect, useState } from "react";
import api from "../api";

export default function About() {
  const [content, setContent] = useState(null);
  const [aboutMedia, setAboutMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/about"),
      api.get("/about-media")
    ])
      .then(([aboutRes, mediaRes]) => {
        setContent(aboutRes.data);
        setAboutMedia(mediaRes.data);
        setLoading(false);
      })
      .catch(() => {
        setContent({
          content: "This platform blends interactive digital art, immersive video backgrounds, and live auctions. Our mission is to revolutionize the way digital art is discovered, valued, and collected."
        });
        setAboutMedia({});
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white pt-20">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">About Our Gallery</h1>
        
        {/* Intro Video Section */}
        {aboutMedia?.introVideoUrl && (
          <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
            <video
              src={aboutMedia.introVideoUrl}
              controls
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="bg-gray-900/50 rounded-lg backdrop-blur border border-gray-700 p-8 mb-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed opacity-90 whitespace-pre-wrap">
              {content?.content || ""}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="text-center">
            <div className="text-4xl mb-4 font-bold">∎</div>
            <h3 className="text-xl font-bold mb-3">Creative Expression</h3>
            <p className="opacity-70">Experience art in interactive ways with p5.js-powered visualizations.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4 font-bold">▶</div>
            <h3 className="text-xl font-bold mb-3">Immersive Media</h3>
            <p className="opacity-70">Video backgrounds and audio integration create an engaging atmosphere.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4 font-bold">⚡</div>
            <h3 className="text-xl font-bold mb-3">Live Auctions</h3>
            <p className="opacity-70">Bid in real-time and own exclusive digital artworks.</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-blue-900/30 rounded-lg border border-blue-500/50 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg opacity-90">
            To empower digital artists and collectors by creating an innovative auction platform that celebrates interactive art and ensures fair, transparent bidding.
          </p>
        </div>
      </div>
    </div>
  );
}
