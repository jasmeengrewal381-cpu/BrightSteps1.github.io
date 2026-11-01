import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import childImage from '../images/child.JPG';
import therapyImage from '../images/sense.jpg';
import sensoryImage from '../images/istockphoto-604362170-612x612.jpg';
import playImage from '../images/armaan.JPG';
import drawingImage from '../images/OIP.webp';
import familyImage from '../images/A-mother-taking-care-of-her-special-need-child-683x1024.png';
import consultationImage from '../images/about.JPG';
import movementImage from '../images/therapy.webp';
import activityImage from '../images/3caa01bc-6299-49c1-8858-4db28e7c5397.JPG';
import roomImage from '../images/87d7a0bb-5fee-4e00-8fa3-54544238255b.JPG';
import careImage from '../images/9a13e145-db65-4807-8d90-39fd759be5dd.JPG';
import { PageHero, SectionHeading } from '../components/Layout';
import { CTASection } from '../components/Shared';
const filters=['All','Therapy','Sensory','Activities','Care'];
const gallery = [
  { image: therapyImage, title: 'Therapy support', category: 'Therapy' },
  { image: sensoryImage, title: 'Sensory exploration', category: 'Sensory' },
  { image: playImage, title: 'Supported play', category: 'Activities' },
  { image: drawingImage, title: 'Creative expression', category: 'Activities' },
  { image: familyImage, title: 'Family partnership', category: 'Care' },
  { image: consultationImage, title: 'Care conversations', category: 'Care' },
  { image: movementImage, title: 'Movement practice', category: 'Therapy' },
  { image: activityImage, title: 'Learning activities', category: 'Activities' },
  { image: roomImage, title: 'Supportive spaces', category: 'Care' },
  { image: careImage, title: 'Individual care', category: 'Therapy' },
];
export default function Gallery(){const [filter,setFilter]=useState('All');const [selected,setSelected]=useState(null);const shown=filter==='All'?gallery:gallery.filter(g=>g.category===filter);return <><PageHero eyebrow="A glimpse of our world" title={<>Little moments. <em>Meaningful progress.</em></>} text="Explore the kinds of environments and activities that can support therapy, discovery, connection and individual development." image={childImage} imageAlt="Child-centred developmental care"/><section className="section"><div className="container"><SectionHeading eyebrow="The gallery" title="A place for different ways to grow" text="Illustrative imagery showing supportive activities and care environments. Images are representative and may not depict BrightSteps staff or clients."/><div className="gallery-filters" role="group" aria-label="Filter gallery">{filters.map(f=><button key={f} className={filter===f?'filter-button selected':'filter-button'} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="gallery-grid">{shown.map((item,i)=><button className={`gallery-item gallery-item-${i%4}`} key={item.title} onClick={()=>setSelected(item)} aria-label={`View ${item.title}`}><img src={item.image} alt={item.title}/><span className="gallery-overlay"><span><small>{item.category}</small><strong>{item.title}</strong></span><span className="gallery-zoom"><ZoomIn size={18}/></span></span></button>)}</div><p className="gallery-disclaimer">Photography is illustrative. Please obtain consent before publishing any identifiable images of children or families.</p></div></section>{selected&&<div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={()=>setSelected(null)}><button className="lightbox-close" onClick={()=>setSelected(null)} aria-label="Close image"><X/></button><img src={selected.image} alt={selected.title} onClick={e=>e.stopPropagation()}/><div className="lightbox-caption"><span>{selected.category}</span><strong>{selected.title}</strong></div></div>}<CTASection/></>}
