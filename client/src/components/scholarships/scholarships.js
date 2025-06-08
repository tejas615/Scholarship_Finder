import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { Form } from './form.js';
import { ScholarshipDisplay } from './scholarshipDisplay.js';


import './styles.css';
import './fade.css';

import { getScholarships, getSearchResult } from '../../actions/scholarships.js';

export default function Scholarships() {
  const dispatch = useDispatch();
  const scholarships = useSelector((state) => state.scholarships);
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(getScholarships());
    setShow(true);
  }, [dispatch]);

  const getSearchData = async (e) => {
    const searchTerm = e.target.value;
    dispatch(getSearchResult(searchTerm));
  };


  return (
    <div className="App">
      <div className="main">
        <h2 className="scholarshiph">Scholarships</h2>
      </div>
      <div>
        <Form getSearchData={getSearchData} />
      </div>
      <section className="Cards">
        <CSSTransition
          in={show}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div >
            <ScholarshipDisplay state={scholarships} />
          </div>
        </CSSTransition>
      </section>
    </div>
  );
}
