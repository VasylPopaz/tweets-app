import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UsersList, LoadMoreBtn, GoBackLink, Filter, Loader } from 'components';

import { getUsers, increasePage } from 'storeRedux';
import { useUsers } from 'hooks';

import s from './Tweets.module.css';

const Tweets = () => {
  const { isLoading, users, filteredUsers, page, filter, error } = useUsers();

  const dispatch = useDispatch();

  const location = useLocation();
  const backLinkHref = useRef(location.state?.from ?? '/');

  const prevPageRef = useRef(page);

  const showLoadMore = page < 5 && filteredUsers?.length;

  useEffect(() => {
    if (users.length < 3)
      dispatch(getUsers({ params: { page: 1, limit: 3 } }))
        .unwrap()
        .then(() => {})
        .catch(() =>
          toast.error('Sorry, something went wrong. Please try again.')
        );
  }, [dispatch, users.length]);

  useEffect(() => {
    if (prevPageRef.current !== page) {
      const config = {
        params: {
          page,
          limit: 3,
        },
      };
      dispatch(getUsers(config))
        .unwrap()
        .then(() => {
          prevPageRef.current = page;
        })
        .catch(() =>
          toast.error('Sorry, something went wrong. Please try again.')
        );
    }
  }, [dispatch, page]);

  const handleLoadMoreClick = () => {
    dispatch(increasePage());
  };

  return (
    <section className={s.tweets}>
      {isLoading ? <Loader /> : null}
      <div className={`container`}>
        {error ? (
          <h2 className={s.errorTitle}>
            Sorry, something went wrong. Please try again.
          </h2>
        ) : (
          <>
            <div className={s.wrapper}>
              <GoBackLink to={backLinkHref.current} />
              <Filter />
            </div>
            {!filteredUsers?.length && !isLoading ? (
              <h2 className={s.title}>
                No users with status "{filter}". Try choosing another filter
                value.
              </h2>
            ) : null}
            <UsersList />
            {showLoadMore ? (
              <LoadMoreBtn onClick={handleLoadMoreClick} />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default Tweets;
