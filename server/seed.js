import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Art from './models/Art.js';
import About from './models/About.js';
import Contact from './models/Contact.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Art.deleteMany({});
    await About.deleteMany({});
    
    // Create sample artworks
    const artworks = [
      {
        title: "Digital Dreams",
        description: "An interactive exploration of consciousness through p5.js visualizations and immersive video backgrounds.",
        imageUrl: "https://picsum.photos/800/600?random=1",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        auctionEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Quantum Ripples",
        description: "A mesmerizing piece combining algorithmic art with real-time interaction, featuring a magnifying lens effect.",
        imageUrl: "https://picsum.photos/800/600?random=2",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        auctionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Chromatic Synthesis",
        description: "An audio-visual masterpiece where colors respond to mathematical patterns and user interaction.",
        imageUrl: "https://picsum.photos/800/600?random=3",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        auctionEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Neural Canvas",
        description: "Generated through neural networks and artistic intuition, this piece evolves with viewer interaction using p5.js.",
        imageUrl: "https://picsum.photos/800/600?random=4",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        auctionEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Infinity Mirror",
        description: "A recursive visual experience with infinite depth, powered by p5.js pixel manipulation and video crossfading.",
        imageUrl: "https://picsum.photos/800/600?random=5",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerJoyrides.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        auctionEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Temporal Flux",
        description: "An ever-changing artwork that captures the essence of time and motion through algorithmic design.",
        imageUrl: "https://picsum.photos/800/600?random=6",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        auctionEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      }
    ];

    await Art.insertMany(artworks);
    console.log('✓ Seeded 6 artworks');

    // Create about content
    await About.create({
      content: "Welcome to our interactive art auction platform. We celebrate digital creativity through immersive p5.js visualizations, video backgrounds, and live bidding. Our mission is to revolutionize how digital art is discovered, valued, and collected by bringing interactive experiences to the forefront of the art world."
    });
    console.log('✓ Seeded about content');

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nAdmin Login:');
    console.log('Password: admin123');
    console.log('\nSample artworks have been created with expiring auctions.');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
