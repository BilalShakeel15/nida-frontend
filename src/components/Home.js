import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import first from '../images/first.jpg'
import second from '../images/second.jpg'
import third from '../images/third.jpg'
import card1 from '../images/card1.jpg'
import card2 from '../images/card2.jpg'
import card3 from '../images/card3.jpg'
import pinkShape from '../images/pink_floating.png'
import bilal from '../images/bilal.jpg'
import talmeeha from '../images/talmeeha.jpeg'
import shaheer from '../images/shaheer.jpeg'
import timelineImage from '../images/Subtract.png'
import Prefooter from './Prefooter';
import { useNavigate } from "react-router-dom";
import HeroCarousel from './HeroCarousel';

const Home = ({ introText = "Unique handmade flowers, leaves, die cuts, and more crafted with love and creativity." }) => {
  const API = process.env.REACT_APP_API_URL;
  const [banner, setBanner] = useState([]);
  const navigate = useNavigate();
  const temp = `${API}/uploads/`;
  if (localStorage.getItem('item')) {
    console.log("Removing item");
    localStorage.removeItem('item');
  }

  useEffect(() => {
    const fetchbanner = async () => {
      try {
        const response = await fetch(`${API}/api/admin/getbanner`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const json = await response.json();
        setBanner(json.temp_banner);
        // console.log(banner);

      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchbanner();
  }, [])

  // useEffect(() => {
  //   // const carousel = document.querySelector('#carouselEx');
  //   // const carouselInstance = new window.bootstrap.Carousel(carousel, {
  //   //   interval: 3000,
  //   //   pause: 'hover',
  //   //   ride: 'carousel'
  //   // });
  //   const about_content = document.querySelector('.about');
  //   const handlescroll = () => {
  //     let scroll = window.scrollY;
  //     let about_para = about_content.offsetTop;
  //     if (about_para) {
  //       about_para = about_para - window.innerHeight / 2;
  //       if (scroll > about_para) {
  //         about_content.classList.add('show');
  //       }
  //       else {
  //         about_content.classList.remove('show');
  //       }
  //     }

  //   }
  //   window.addEventListener('scroll', handlescroll);

  //   return () => {
  //     window.removeEventListener('scroll', handlescroll);
  //     // carouselInstance.dispose();

  //   }
  // }, [])



  const timelineData = [
    {
      year: "2007",
      title: "Established",
      heading: "Handmade Creations That Inspire Beauty and Joy Since 2007",
      image: first,
      description:
        "It began in a small room in 2007, where every creation was made by hand.What started as heartfelt gifts for friends and family soon became something more.With growing love and support, Nida Handmade Cards began sharing its craft online."
    },
    {
      year: "2015",
      title: "Expansion",
      heading: "Expanding Creative Horizons",
      image: second,
      description:
        "In 2015, Nida Handmade Cards stepped beyond its studio with its first exhibition.The response encouraged the brand to continue showcasing its creations year after year.From 2013 to 2017, each exhibition became a milestone in the brand’s growing journey."
    },
    {
      year: "2017",
      title: "Recognition",
      heading: "From Local to Recognized Brand",
      image: third,
      description:
        "As the brand grew, its work gained wider recognition through interviews with news channels and newspapers.Nida Handmade Cards was featured across media platforms, reaching audiences beyond exhibitions.Television showcases helped establish the brand as a recognized name in handcrafted art."
    },
    {
      year: "2019",
      title: "Worldwide",
      heading: "Inspiring DIY Communities Worldwide",
      image: first,
      description:
        "In 2019, Nida Handmade Cards marked a historic milestone by becoming the first from Pakistan’s creative industry to be selected for an international design team.This recognition opened doors to global collaborations and creative platforms.By 2026, the brand continues to be part of multiple design teams worldwide, proudly representing Pakistan."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);


  const reviews = [
    {
      name: "Michael Lee",
      role: "Travel Enthusiast",
      text: "Winzy made my trip effortless! The booking process was seamless, and the stay was beyond expectations. Highly recommend!Winzy made my trip effortless! The booking process was seamless, and the stay was beyond expectations. Highly recommend!",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Alex Morgan",
      role: "Digital Nomad",
      text: "Everything felt smooth and easy. Customer support was quick and very friendly!",
      image: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Sarah Williams",
      role: "Digital Nomad",
      text: "A flawless experience from start to finish. I’ll definitely use this again.",
      image: "https://i.pravatar.cc/100?img=3",
    },
    {
      name: "Olivia Thompson",
      role: "Adventure Seeker",
      text: "The service was beyond my expectations. It truly made my trip memorable.",
      image: "https://i.pravatar.cc/100?img=4",
    },
    {
      name: "David Chen",
      role: "Photographer",
      text: "Incredible platform! The design is beautiful and everything just works.",
      image: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Emma Brown",
      role: "Travel Blogger",
      text: "Such an easy way to plan my trip. Will recommend to my friends for sure!",
      image: "https://i.pravatar.cc/100?img=6",
    },
    {
      name: "James Taylor",
      role: "Backpacker",
      text: "I love how intuitive everything felt. It saved me so much time.",
      image: "https://i.pravatar.cc/100?img=7",
    },
    {
      name: "Sophia Wilson",
      role: "Designer",
      text: "Great design, great features, and top-notch support. Couldn’t ask for more!",
      image: "https://i.pravatar.cc/100?img=8",
    },
    {
      name: "Ethan Johnson",
      role: "Explorer",
      text: "Traveling has never been easier for me. Kudos to the team!",
      image: "https://i.pravatar.cc/100?img=9",
    },
    {
      name: "Mia Davis",
      role: "Nomad",
      text: "One of the best tools I’ve used. Made everything simple and enjoyable.",
      image: "https://i.pravatar.cc/100?img=10",
    },
    {
      name: "Daniel Martinez",
      role: "Engineer",
      text: "From signup to booking – everything was seamless. I’m impressed.",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      name: "Isabella White",
      role: "Writer",
      text: "Beautiful interface and great usability. I’ll use it again soon!",
      image: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Isabella White",
      role: "Writer",
      text: "Beautiful interface and great usability. I’ll use it again soon!",
      image: "https://i.pravatar.cc/100?img=12",
    },
  ];

  const [activeTestiIndex, setActiveTestiIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef(null);

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + 4);

  return (
    <>
      <HeroCarousel />

      {/* // About */}
      <div className="about-bg" id="about">
        <div className="container about">
          <div className="row align-items-start">
            {/* Left Column */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              {/* <h2 className="about-heading">Your Ideas, Our Craft Handmade </h2>
              <h3 className="about-heading">
                Products That Inspire Creativity
              </h3> */}

              <div className="about-image-wrapper">
                <img
                  src={first}
                  alt="Nida Handmade Crafts"
                  className="img-fluid about-main-image"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-6">
              {/* Small Images */}
              <div className="row mb-4">
                <div className="col-6">
                  <div className="about-small-image">
                    <img
                      src={second}
                      alt="Handmade Product 1"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="about-small-image">
                    <img
                      src={third}
                      alt="Handmade Product 2"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="about-description">
                At Nida Handmade, we believe every detail matters. From delicate
                paper flowers to elegant die cuts, our products are designed to add
                beauty and meaning to your crafts, decor, and celebrations. Each
                piece is made with passion and perfection.
              </p>

              {/* Stats */}
              <div className="row stats-row">
                <div className="col-4">
                  <h4 className="stat-number">10k+</h4>
                  <p className="stat-label">Orders Dispatched</p>
                </div>
                <div className="col-4">
                  <h4 className="stat-number">10k+</h4>
                  <p className="stat-label">Happy Customers</p>
                </div>
                <div className="col-4">
                  <h4 className="stat-number">10k+</h4>
                  <p className="stat-label">Unique Products</p>
                </div>
              </div>

              {/* Reviews */}
              <div className="reviews-section">
                <div className="d-flex align-items-center">
                  <div className="review-avatars">
                    <img src={talmeeha} alt="Customer" className="review-avatar" />
                    <img src={bilal} alt="Customer" className="review-avatar" />
                    <img src={shaheer} alt="Customer" className="review-avatar" />
                  </div>
                  <span className="review-text">10K+ Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      { /* Timeline section */}

      <div className="timeline-section container">
        <div className="timeline-content">
          {/* Animated Heading & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2>{timelineData[activeIndex].heading}</h2>
              <p>{timelineData[activeIndex].description}</p>
            </motion.div>
          </AnimatePresence>

          <button
            className="shop-btn"
            onClick={() => navigate("/categorydisplay")}
          >
            Shop Now
          </button>


          {/* Timeline */}
          <div className="timeline">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${activeIndex === index ? "active" : ""
                  }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="year">{item.year}</div>
                <div className="circle"></div>
                <div className="title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="timeline-image">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <img src={timelineData[activeIndex].image} alt="timeline visual" className="clipped-img" />

            </motion.div>
          </AnimatePresence>
        </div>

      </div>


      {/* Testimonial section */}
      <div className="testimonials-section">
        <div className="top-section">
          <div className="testimonials-left">
            <div className="testimonials-label">Testimonials</div>
            <h2>What our happy</h2>
            <h2>Customers say</h2>
            <p>
              Real stories from people who made their projects shine with Nida Handmade Cards.
            </p>
          </div>

          <div className="testimonials-right">
            <div className="review-card">
              <div className="review-header">
                <img
                  src={reviews[activeTestiIndex].image}
                  alt={reviews[activeTestiIndex].name}
                />
                <div>
                  <h4>{reviews[activeTestiIndex].name}</h4>
                  <span>{reviews[activeTestiIndex].role}</span>
                </div>
              </div>
              <p>{reviews[activeTestiIndex].text}</p>
            </div>
          </div>
        </div>

        <div className="reviewers-wrapper">
          <button className="arrow-btn left" onClick={handlePrev}>
            ‹
          </button>

          <div className="reviewers-list" ref={scrollRef}>
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`reviewer ${activeTestiIndex === index ? "active" : ""}`}
                onClick={() => setActiveTestiIndex(index)}
              >
                <img src={review.image} alt={review.name} />
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <span>{review.role}</span>
                </div>
                {activeTestiIndex === index && <div className="underline"></div>}
              </div>
            ))}
          </div>

          <button className="arrow-btn right" onClick={handleNext}>
            ›
          </button>
        </div>

      </div>


      {/* <Prefooter /> */}




    </>
  )
}

export default Home
