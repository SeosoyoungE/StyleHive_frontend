// SearchResults.js

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './SearchResults.css';

import SearchInput from './searchs/SearchInput'; // 검색바

const SearchResults = () => {
  return (
    <>
    <Header />
    <div className="container r_content">
      <div className='search_title'>
        <SearchInput/>
        <div className='related_keywords'>
          <p className='title'>연관</p>
          <div className='keywords'>
            <a className='keyword'><p>ugg 타스만</p></a>
            <a className='keyword'><p>남성 어그 슬리퍼</p></a>
            <a className='keyword'><p>어그 클래식 미니 플랫폼</p></a>
            <a className='keyword'><p>어그 부츠</p></a>
            <a className='keyword'><p>어그 울트라 미니</p></a>
            <a className='keyword'><p>락피쉬 어그</p></a>
            <a className='keyword'><p>마르디 어그</p></a>
            <a className='keyword'><p>어그 신발</p></a>
          </div>
        </div>
      </div>

        <nav className='shop_tab'>
          <div className='tabs'>
            <ul className='ul_tab'>
              <li className='li_tab'>
                <a className='tab'><span className='tab_name'>상품</span></a>
              </li>
              <li className='li_tab'>
                <a className='tab'><span className='tab_name'>스타일</span></a>
              </li>
              <li className='li_tab'>
                <a className='tab'><span className='tab_name'>프로필</span></a>
              </li>
            </ul>
          </div>
        </nav>

    </div>
    <Footer />
    </>
  );
};

export default SearchResults;
