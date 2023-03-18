import {useParams} from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Footer from '../components/Footer';
import Lesson from '../components/Lesson';
import { useState, useRef, useEffect } from "react";
import Hls from 'hls.js';

const CoursePage = () => {
  const {id} = useParams();
  let {data, loading, error} = useFetch(`https://api.wisey.app/api/v1/core/preview-courses/${id}`);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(localStorage.getItem('previewVideoProgress') || 0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      data && hls.loadSource(data.meta.courseVideoPreview.link);
      hls.attachMedia(videoRef.current);
    }
  }, [data]);

  useEffect(() => {
    if (Hls.isSupported()) {
      const video = videoRef.current;
      if (!video) return;

      const onTimeUpdate = () => {
        const time = video.currentTime;
        setProgress(time);
        localStorage.setItem('previewVideoProgress', time);
      };

      const onEnded = () => {
        setProgress(0);
        localStorage.setItem('previewVideoProgress', 0);
      };

      const onPlay = () => {
        video.currentTime = progress;
      };

      video.addEventListener('play', onPlay);
      video.addEventListener('ended', onEnded);
      video.addEventListener('pause', onTimeUpdate);

      return () => {
        video.removeEventListener('pause', onTimeUpdate);
        video.removeEventListener('ended', onEnded);
        video.removeEventListener('play', onPlay);
      };
    }
  }, [data, progress]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyW') { 
        setPlaybackSpeed(speed => speed + 0.25);
      } else if (event.code === 'KeyQ') { 
        setPlaybackSpeed(speed => speed > 0.5 && speed - 0.25);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  useEffect(() => {
    if (Hls.isSupported()) {
      const video = videoRef.current;
      if (!video) return;

      video.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  return (
    <>
      <Link to="/" className="text-decoration-none fw-bold display-6">←Back</Link>
      <br/>
      {loading && 
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>}
      {error && <div className="alert alert-danger" role="alert">{error.message}</div>}
      {data && ((data.statusCode === 401 || data.statusCode === 400) ? <div className="alert alert-danger" role="alert">{data.message}</div> :
      <>
        <h1 className="display-2">{data.title}</h1>
        <div className='course-info'>
          <img className="course-img" src={`${data.previewImageLink}/cover.webp`} alt="Course"/>
          <div>
            <p className="course-description"><i>{data.description}</i></p>
            {Array.isArray(data.tags) && <div className='mb-3'>
              {data.tags.map((item) => (
                  <span className='badge bg-success' key={item}>
                    {item}
                  </span>
                ))}
              </div>}
            {Array.isArray(data.meta.skills) && <>
              <p><b>Skills:</b> </p>
              <ul>
                {data.meta.skills.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </>}
            <p><b>Lessons count:</b> {data.lessons.length}</p>
            <p><b>Rating:</b> {data.rating}</p>
          </div>
        </div>
        {data.meta.courseVideoPreview && <video ref={videoRef} className='preview-video' controls/>}
        {data.meta.courseVideoPreview && <div className='preview-video'><b>Video speed:</b> {playbackSpeed}x. To change speed use Q and W keys.</div>}
        <h3 className="display-3">Lessons:</h3>
        {data.lessons.map((item) => (
          <Lesson key={item.id} item={item} />
        ))}
      </>
      )}
      <Footer />
    </>
  )
};

export default CoursePage;
