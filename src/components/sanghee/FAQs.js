// FAQs.js

import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Footer from './Footer';
import Nav from './Nav';
import './FAQs.css';
import axios from 'axios';  // axios import 추가

const FAQs = () => {
  // FAQ 목록을 담을 상태
  const [faqList, setFaqList] = useState([]);

  // 선택한 카테고리와 세부 내용을 관리할 상태
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTitles, setSelectedTitles] = useState([]);

  // 선택한 페이지 번호를 관리할 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지당 아이템 개수
  const itemsPerPage = 20;

  // 검색어를 관리할 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어를 지우는 함수
  const clearSearchTerm = () => {
    setSearchTerm('');
    setShowSearchResults(false);
    setSelectedCategory('전체');
    setCurrentPage(1);
    setSelectedTitles(faqList);
  };

  // useRef 추가
  const searchInputRef = useRef(null);

  // 검색 결과를 표시할지 여부를 나타내는 상태
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 초기 선택 카테고리에 대한 제목 설정
  useEffect(() => {
    handleCategoryClick('전체');
  }, []);

  // useEffect 내부에서 useRef 설정
  useEffect(() => {
    // useRef를 사용하여 DOM 엘리먼트에 접근
    const searchInput = searchInputRef.current;

    // 포커스 이벤트 리스너 등록
    const handleFocus = () => {
      searchInput.removeAttribute('placeholder');
    };

    const handleBlur = () => {
      searchInput.setAttribute('placeholder', '검색어를 입력하세요');
    };

    searchInput.addEventListener('focus', handleFocus);
    searchInput.addEventListener('blur', handleBlur);

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      searchInput.removeEventListener('focus', handleFocus);
      searchInput.removeEventListener('blur', handleBlur);
    };
  }, []);

  // 카테고리 클릭 처리 함수
  const handleCategoryClick = (category) => {
    if (category === '전체') {
      setShowSearchResults(false);
      setSelectedCategory(category);
      setCurrentPage(1);
      setSelectedTitles(faqList);
    } else {
      const selectedFaqs = faqList.filter((faq) => faq.faqCate === category);
      setShowSearchResults(false);
      setSelectedCategory(category);
      setCurrentPage(1);
      setSelectedTitles(selectedFaqs);
    }
  };

  // 선택한 FAQ의 ID를 관리할 상태
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  // FAQ 제목 클릭 처리 함수
  const handleTitleClick = (faqId) => {
    setSelectedFaqId((prevId) => (prevId === faqId ? null : faqId));
  };

  // 페이지 변경 처리 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 처리 함수
  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);

    // 검색어가 비어 있는지 확인
    if (newSearchTerm.trim() === '') {
      setShowSearchResults(false);
      setSelectedCategory('전체');
      setSelectedTitles(faqList);
    }
  };

  // 엔터 키 입력 처리 함수
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (searchTerm.trim() === '') {
        // 검색어가 비어 있는 경우 초기 상태로 되돌림
        setShowSearchResults(false);
        setSelectedCategory('전체');
        setSelectedTitles(faqList);
      } else {
        handleSearch();
      }
    }
  };

  // 검색 실행 함수
  const handleSearch = () => {
    setCurrentPage(1);

    // 원래의 FAQ 목록에서 검색 수행
    const filteredTitles = faqList.filter((faq) =>
      faq.faqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.faqContent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 검색 결과가 있을 경우에만 표시
    setShowSearchResults(filteredTitles.length > 0);

    setSelectedTitles(filteredTitles);
  };

  // 페이징 처리
  const totalPages = Math.ceil(selectedTitles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedTitles.slice(indexOfFirstItem, indexOfLastItem);

  // 컴포넌트가 마운트될 때 FAQ 데이터를 받아옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/faq/all');
        setFaqList(response.data);
        setSelectedTitles(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <Header />
      <div className="container">
    <Nav />
    <div className="question-container">
      <div className="question-container-header">
        <h3>자주 묻는 질문</h3>
      </div>

      {/* 검색 바 */}
      <div className="search">
        <input
          type="text"
          ref={searchInputRef}
          placeholder="검색"
          value={searchTerm}
          onChange={handleSearchTermChange}
          onKeyPress={handleKeyPress}
          className='search-bar'
        />
        {searchTerm && (
          <button className="clear-icon" onClick={clearSearchTerm}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {/* 테이블 또는 검색 결과 표시 */}
      {selectedTitles.length === 0 ? (
        <div className="no-results-message">
          <p>검색하신 결과가 없습니다.</p>
        </div>
      ) : (
      !showSearchResults ? (
        <table className="category-table">
          <tbody>
            {[0, 1].map((rowIndex) => (
              <tr key={rowIndex}>
                {[0, 1, 2].map((colIndex) => {
                  const categoryIndex = rowIndex * 3 + colIndex;
                  const category = ['전체', '이용정책', '공통', '구매', '판매'][categoryIndex];
                  return (
                    <td
                      key={category}
                      className={`category-item ${category === selectedCategory ? 'selected' : ''} ${categoryIndex >= 5 ? 'empty-cell' : ''}`}
                      onClick={() => categoryIndex < 5 && handleCategoryClick(category)}
                    >
                      <a>{category}</a>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="search-results-info">
          <p><strong>{selectedTitles.length}개</strong>의 검색결과</p>
        </div>
      )
    )}

      <div className="title-list">
        {currentItems.map((faq) => (
          <div key={faq.faqNo} className={`title-item ${faq.faqCate === '전체' ? 'empty-cell' : ''}`} onClick={() => handleTitleClick(faq.faqNo)}>
            <div className="title-item-header">
              <strong className='faq-category'>{faq.faqCate}</strong>
              <p className='faq-title'>{faq.faqTitle}</p>            
              <FontAwesomeIcon icon={selectedFaqId === faq.faqNo ? faAngleUp : faAngleDown} className='faq-icon' />
            </div>
            <div className='title-item-content'>
              {selectedFaqId === faq.faqNo && <p dangerouslySetInnerHTML={{ __html: faq.faqContent }} />}
            </div>
          </div>
        ))}
      </div>

      {/* 페이징 컴포넌트 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <span
            key={page}
            className={`pagination-item ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </span>
        ))}
      </div>
    </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQs;
