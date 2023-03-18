import useFetch from '../hooks/useFetch';
import { Link } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import CourseComponent from './CourseComponent';

function CoursesList() {
  let {data, loading, error} = useFetch('https://api.wisey.app/api/v1/core/preview-courses');
  const [courses, setCourses] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  
  useEffect(() => {
    if (data && data.courses) {
      setCourses(data.courses.reverse())
    }
  }, [data]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.courses.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      {loading && 
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>}
      {error && <div className="alert alert-danger" role="alert">{error.message}</div>}
      {data && 
        <div className='pagination'>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(courses.length / itemsPerPage)}
            previousLabel="< previous"
            renderOnZeroPageCount={null}/>
        </div>
      }
      {data && (data.statusCode === 401 ? <div className="alert alert-danger" role="alert">{data.message}</div> :
      courses.slice(itemOffset, itemOffset + itemsPerPage).map((item) => (
        <>
          <Link key={item.id}  to={`/course/${item.id}`} className="text-decoration-none text-dark"><CourseComponent item={item} /></Link>
        </>
      )))}
      {data && 
        <ReactPaginate
          className='pagination'
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(courses.length / itemsPerPage)}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />}
    </div>
  );
}

export default CoursesList;
