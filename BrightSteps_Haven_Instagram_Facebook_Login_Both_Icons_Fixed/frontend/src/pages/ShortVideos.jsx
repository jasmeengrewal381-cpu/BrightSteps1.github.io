import { API_BASE } from '../api';
import React, { useEffect, useState } from 'react';
import { Play, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, SectionHeading } from '../components/Layout';
import { CTASection } from '../components/Shared';

const fallbackVideos = [
  { title: 'Occupational Therapy & Sensory Processing', category: 'Therapy', description: 'An educational introduction to occupational therapy and sensory processing support.', videoUrl: 'https://www.youtube.com/watch?v=8GTHFr6uEkk' },
  { title: 'Speech Therapy for Young Children', category: 'Development', description: 'Educational guidance about early speech and communication.', videoUrl: 'https://www.youtube.com/watch?v=3YlOWLU85m4' },
  { title: 'Toe Walking: What Parents Should Know', category: 'Rehabilitation', description: 'General information about toe walking and seeking professional advice.', videoUrl: 'https://www.youtube.com/watch?v=Ox7ZveFC894' },
  { title: 'Sensory Play Explained', category: 'Activities', description: 'An introduction to sensory play and child development.', videoUrl: 'https://www.youtube.com/watch?v=qmbjDdCkvP8' },
  { title: 'Feeding Therapy for Children', category: 'Care', description: 'An educational introduction to feeding therapy.', videoUrl: 'https://www.youtube.com/watch?v=h4BHe8Ak8eQ' },
  { title: 'Visual Supports for Families', category: 'Family Support', description: 'Learn about visual schedules and visual supports.', videoUrl: 'https://www.youtube.com/watch?v=tL6whdhq7j4' },
];

function getVideoId(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    let id = '';
    if (host === 'youtu.be') id = parsed.pathname.split('/').filter(Boolean)[0] || '';
    else if (host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') id = parts[1] || '';
      else id = parsed.searchParams.get('v') || '';
    }
    return /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : '';
  } catch { return ''; }
}
function getEmbedUrl(url) {
  const id = getVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : '';
}
function getWatchUrl(url) {
  const id = getVideoId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : (url || 'https://www.youtube.com/');
}

export function ShortVideosSection() {
  const [videos, setVideos] = useState(fallbackVideos);
  const [failedFrames, setFailedFrames] = useState({});
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadMessage, setLoadMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/videos`)
      .then(response => { if (!response.ok) throw new Error('Video library is temporarily unavailable.'); return response.json(); })
      .then(data => { if (active && Array.isArray(data.videos)) setVideos(data.videos); })
      .catch(() => { if (active) setLoadMessage('Showing the starter video list. If a video does not play here, use Watch on YouTube.'); })
      .finally(() => { if (active) setLoadingVideos(false); });
    return () => { active = false; };
  }, []);

  return <section className="section shorts-section">
      <div className="container">
        <SectionHeading eyebrow="Watch & learn" title="Our services, in short videos" text="Explore educational videos about therapy, development, sensory activities, rehabilitation and family support." />
        {loadMessage && <p className="shorts-load-message" role="status">{loadMessage}</p>}
        {loadingVideos && <p className="shorts-load-message">Loading videos…</p>}
        {!loadingVideos && videos.length === 0 && !loadMessage && <p className="shorts-load-message" role="status">There are no videos available right now. Please check back later.</p>}
        <div className="shorts-grid">
          {videos.map((video, index) => {
            const embedUrl = getEmbedUrl(video.videoUrl);
            const watchUrl = getWatchUrl(video.videoUrl);
            const frameFailed = failedFrames[video._id || index];
            return <article className="short-card" key={video._id || video.title || index}>
              <div className="short-video-frame">
                {embedUrl && !frameFailed ? <iframe src={embedUrl} title={video.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen onError={() => setFailedFrames(old => ({ ...old, [video._id || index]: true }))} /> : <div className="short-placeholder"><span className="short-play-icon"><Play size={25} fill="currentColor" /></span><span className="short-placeholder-label">VIDEO PLAYER UNAVAILABLE</span><strong>{video.title}</strong><p>Open this video directly on YouTube.</p></div>}
              </div>
              <div className="short-card-copy"><span className="short-category">{video.category || 'Care'}</span><h3>{video.title}</h3><p>{video.description}</p><a className="short-watch-link" href={watchUrl} target="_blank" rel="noreferrer"><Play size={15} fill="currentColor" /> Watch on YouTube</a></div>
            </article>;
          })}
        </div>
        <div className="shorts-note"><Video size={23} /><div><strong>Educational videos for families</strong><p>Videos are provided for general information and do not replace advice from your child’s qualified care professional. Some videos may restrict embedded playback; the Watch on YouTube link remains available.</p></div></div>
        <div className="shorts-bottom-cta"><Video size={24}/><div><h3>Want to learn more about a service?</h3><p>Explore our care services or contact BrightSteps Haven for more information.</p></div><Link className="button" to="/services">Explore services</Link></div>
      </div>
    </section>;
}

export default function ShortVideos() {
  return <>
    <PageHero eyebrow="Watch & learn" title={<>Care in a few moments. <em>One short at a time.</em></>} text="Explore short videos about therapy, development, sensory activities, rehabilitation and family support at BrightSteps Haven." />
    <ShortVideosSection />
    <CTASection />
  </>;
}
