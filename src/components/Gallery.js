import React from 'react'
import card1 from '../images/card1.jpg'
import card2 from '../images/card2.jpg'
import card3 from '../images/card3.jpg'
// import first from '../images/card1.jpg'

const Gallery = () => {
  return (
    <>
    <div class="navbar-space"></div>
    <h1 class="gallery-title">Creative Expressions</h1>
    <div class="gallery-container">
        <div class="gallery-item"><img src={card1} alt="Gallery Image 1" /></div>
        <div class="gallery-item"><img src={card2} alt="Gallery Image 2" /></div>
        <div class="gallery-item"><img src={card3} alt="Gallery Image 3" /></div>
        <div class="gallery-item"><img src={card1} alt="Gallery Image 4" /></div>
        <div class="gallery-item"><img src={card2} alt="Gallery Image 5" /></div>
        <div class="gallery-item"><img src={card3} alt="Gallery Image 6" /></div>
    </div>
    </>
  )
}

export default Gallery
