import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import p5 from "p5";

export default function P5Gallery({ artworks }) {
  const containerRef = useRef(null);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const musicRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const preloadedImagesRef = useRef([]);
  const currentImgRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const activeVideoRef = useRef("A");
  const navigate = useNavigate();

  const crossfadeBackground = (src) => {
    if (!videoARef.current || !videoBRef.current) return;

    if (!src) {
      videoARef.current.removeAttribute("src");
      videoBRef.current.removeAttribute("src");
      return;
    }

    const incoming =
      activeVideoRef.current === "A" ? videoBRef.current : videoARef.current;
    const outgoing =
      activeVideoRef.current === "A" ? videoARef.current : videoBRef.current;

    incoming.src = src;
    incoming.load();

    incoming.oncanplay = () => {
      incoming.classList.remove("opacity-0");
      outgoing.classList.add("opacity-0");
      incoming.play().catch(() => {});
      activeVideoRef.current = activeVideoRef.current === "A" ? "B" : "A";
    };
  };

  useEffect(() => {
    if (!artworks || artworks.length === 0) return;

    currentIndexRef.current = 0;
    let hoverTimer = null;
    let p5Instance;

    const sketch = (p) => {
      let preloadedImages = new Array(artworks.length).fill(null);
      const canvasW = 600;
      const canvasH = 400;

      // ✅ LOAD IMAGES IN SETUP (p5 v2 compliant)
      p.setup = async () => {
        p.createCanvas(canvasW, canvasH).parent(containerRef.current);

        // preload all images asynchronously with error handling
        for (let i = 0; i < artworks.length; i++) {
          try {
            if (!artworks[i].imageUrl) {
              console.warn(`No image URL for artwork ${i}`);
              preloadedImages[i] = null;
              continue;
            }
            const img = await new Promise((resolve, reject) => {
              p.loadImage(
                artworks[i].imageUrl,
                (loaded) => resolve(loaded),
                () => reject(new Error(`Failed to load image: ${artworks[i].imageUrl}`))
              );
            });
            console.log(`Loaded image: ${artworks[i].title}`);
            preloadedImages[i] = img;
            if (!currentImgRef.current) {
              currentImgRef.current = img;
            }
          } catch (error) {
            console.error(`Error loading image for ${artworks[i].title}:`, error);
            preloadedImages[i] = null;
          }
        }

        preloadedImagesRef.current = preloadedImages;
        if (!currentImgRef.current) {
          currentImgRef.current = preloadedImages.find(Boolean) || null;
        }
      };

      p.draw = () => {
        p.background(0);

        if (currentImgRef.current) {
          p.image(currentImgRef.current, 0, 0, p.width, p.height);
          pixelMagnifier(p, currentImgRef.current);
        } else {
          p.fill(255);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.text("Image unavailable", p.width / 2, p.height / 2);
        }
      };

      function pixelMagnifier(p, img) {
        const lensRadius = 60;
        const zoom = 2.5;

        if (!img) return;

        const scaleX = img.width / p.width;
        const scaleY = img.height / p.height;

        const imgMouseX = p.mouseX * scaleX;
        const imgMouseY = p.mouseY * scaleY;

        const sw = ((lensRadius * 2) / zoom) * scaleX;
        const sh = ((lensRadius * 2) / zoom) * scaleY;

        let sx = imgMouseX - sw / 2;
        let sy = imgMouseY - sh / 2;

        sx = p.constrain(sx, 0, img.width - sw);
        sy = p.constrain(sy, 0, img.height - sh);

        p.drawingContext.save();
        p.drawingContext.beginPath();
        p.drawingContext.arc(p.mouseX, p.mouseY, lensRadius, 0, p.TWO_PI);
        p.drawingContext.clip();

        p.image(
          img,
          p.mouseX - lensRadius,
          p.mouseY - lensRadius,
          lensRadius * 2,
          lensRadius * 2,
          sx,
          sy,
          sw,
          sh
        );

        p.drawingContext.restore();
        p.noFill();
        p.stroke(255, 200);
        p.circle(p.mouseX, p.mouseY, lensRadius * 2);
      }

      function nextArtwork() {
        const nextIndex = (currentIndexRef.current + 1) % artworks.length;
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        if (preloadedImagesRef.current[nextIndex]) {
          currentImgRef.current = preloadedImagesRef.current[nextIndex];
        }
        crossfadeBackground(artworks[nextIndex].videoUrl);
      }

      // Attach hover events ONCE
      containerRef.current.onmouseenter = () => {
        if (!hoverTimer) {
          hoverTimer = setInterval(nextArtwork, 3000);
        }
      };

      containerRef.current.onmouseleave = () => {
        clearInterval(hoverTimer);
        hoverTimer = null;
      };

    };

    p5InstanceRef.current = new p5(sketch);

    // ✅ CLEANUP (very important in React)
    return () => {
      if (hoverTimer) clearInterval(hoverTimer);
      if (p5InstanceRef.current) p5InstanceRef.current.remove();
    };
  }, [artworks]);

  useEffect(() => {
    const currentArt = artworks[currentIndex];
    if (!currentArt) return;

    crossfadeBackground(currentArt.videoUrl);

    if (musicRef.current) {
      if (currentArt.audioUrl) {
        musicRef.current.src = currentArt.audioUrl;
      } else {
        musicRef.current.removeAttribute("src");
      }
    }
  }, [artworks, currentIndex]);

  const currentArt = artworks[currentIndex];
  const hasAudio = Boolean(currentArt?.audioUrl);

  return (
    <>
      <video
        ref={videoARef}
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 transition-opacity duration-1000"
      />
      <video
        ref={videoBRef}
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-0 transition-opacity duration-1000"
      />
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-20" />

      <div className="min-h-screen flex flex-col md:flex-row bg-black/60 pt-20">
        {/* Left Panel - Artwork Info */}
        <div className="w-full md:w-1/3 p-8 md:p-16 text-white flex flex-col justify-between border-b md:border-r border-gray-700">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {artworks[currentIndex]?.title}
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {artworks[currentIndex]?.description}
            </p>

            {/* Artwork Stats */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-6 mb-8">
              <div className="flex justify-between mb-4">
                <span className="opacity-70">Auction Timer</span>
                <span className="font-semibold">
                  {new Date(artworks[currentIndex]?.auctionEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Status</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => navigate(`/art/${artworks[currentIndex]?._id}`)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg font-bold transition transform hover:scale-105"
              >
                Go to Auction
              </button>
              <button
                onClick={() => navigate(`/bid/${artworks[currentIndex]?._id}`)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-lg font-bold transition transform hover:scale-105"
              >
                Bid Now
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="space-y-4">
            <div className="text-sm opacity-60">
              {currentIndex + 1} of {artworks.length}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const prev = currentIndex === 0 ? artworks.length - 1 : currentIndex - 1;
                  setCurrentIndex(prev);
                  currentIndexRef.current = prev;
                  if (preloadedImagesRef.current[prev]) {
                    currentImgRef.current = preloadedImagesRef.current[prev];
                  }
                  crossfadeBackground(artworks[prev]?.videoUrl);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  const next = (currentIndex + 1) % artworks.length;
                  setCurrentIndex(next);
                  currentIndexRef.current = next;
                  if (preloadedImagesRef.current[next]) {
                    currentImgRef.current = preloadedImagesRef.current[next];
                  }
                  crossfadeBackground(artworks[next]?.videoUrl);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Canvas and Controls */}
        <div className="w-full md:w-2/3 flex flex-col justify-center items-center relative p-8 md:p-0">
          <div
            ref={containerRef}
            className="shadow-2xl rounded-lg overflow-hidden border border-gray-700"
          />

          {/* Music Control */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <button
              onClick={() => {
                if (musicRef.current) {
                  musicRef.current.paused
                    ? musicRef.current.play()
                    : musicRef.current.pause();
                }
              }}
              disabled={!hasAudio}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {hasAudio ? (musicRef.current?.paused !== false ? "Play" : "Pause") : "No"} Music
            </button>
          </div>

          {/* Hover Indicator */}
          <div className="absolute top-8 right-8 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 text-sm opacity-60">
            Hover to auto-advance
          </div>

          <audio
            ref={musicRef}
            src={currentArt?.audioUrl || undefined}
            loop
          />
        </div>
      </div>
    </>
  );
}
