import { useState, useEffect } from 'react';
import axios from 'axios';
import 'photoswipe/dist/photoswipe.css';
import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe } from 'react-photoswipe';

const RedditGallery = () => {
  const [memes, setMemes] = useState([]);
  const [after, setAfter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      setAfter(after);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [after]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://www.reddit.com/r/memes.json?after=${after}`);
        const newMemes = response.data.data.children.map((child) => ({
          id: child.data.id,
          thumbnail: child.data.thumbnail,
          url: child.data.url,
        }));
        setMemes((prevMemes) => [...prevMemes, ...newMemes]);
        setAfter(response.data.data.after);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [after]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {memes.map((meme, index) => (
        <div
          key={meme.id}
          onClick={() => openGallery(index)}
          style={{
            margin: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <img
            src={meme.thumbnail}
            alt="Meme Thumbnail"
            style={{ width: '200px', height: '150px', objectFit: 'cover' }}
          />
        </div>
      ))}

      {isOpen && (
        <PhotoSwipe
          isOpen={isOpen}
          items={memes.map((meme) => ({ src: meme.url, w: 0, h: 0, title: '' }))}
          options={{ index: currentIndex }}
          onClose={closeGallery}
        />
      )}
    </div>
  );
};

export default RedditGallery;
