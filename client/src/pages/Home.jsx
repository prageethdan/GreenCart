// Home.jsx
import React from 'react';
import MainBanner from '../components/MainBanner';
import Categories from '../components/Categories';
import BestSeller from '../components/BestSeller';
import Bottombanner from '../components/Bottombanner';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    // push content down so it’s not hidden behind navbar
    <div className='mt-10'>  
      <MainBanner />
      <Categories/>
      <BestSeller/>
      <Bottombanner/>
      <NewsLetter/>
    </div>
  );
};

export default Home;
