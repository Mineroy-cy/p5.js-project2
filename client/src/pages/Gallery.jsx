import { useEffect, useState } from "react";
import api from "../api";
import P5Gallery from "../components/P5Gallery";

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    api.get("/art").then(res => {
      const withImages = res.data.filter(art => art?.imageUrl);
      setArtworks(withImages);
    });
  }, []);

  return <P5Gallery artworks={artworks} />;
}
