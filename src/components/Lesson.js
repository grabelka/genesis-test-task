import { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Hls from 'hls.js';

const Lesson = props => {
  const [progress, setProgress] = useState(localStorage.getItem(`videoProgress${props.item.id}`) || 0);
  const [showModal, setShowModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    setShowModal(true);
  };
  const videoRef = useRef(null);
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      props.item.status === "unlocked" && hls.loadSource(props.item.link);
      hls.attachMedia(videoRef.current);
    }
  }, [showModal]);

  useEffect(() => {
    if (Hls.isSupported()) {
      const video = videoRef.current;
      if (!video) return;

      const onTimeUpdate = () => {
        const time = video.currentTime;
        setProgress(time);
        localStorage.setItem(`videoProgress${props.item.id}`, time);
      };
      
      const onEnded = () => {
        setProgress(0);
        localStorage.setItem(`videoProgress${props.item.id}`, 0);
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
  }, [showModal, progress]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyS') { 
        setPlaybackSpeed(speed => speed + 0.25);
      } else if (event.code === 'KeyA') { 
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
      <div onClick={handleClick} className="border border-ligft rounded p-3 mt-3 row">
        <div className="col-4">
          {!imageError && <img className="lesson-img" src={`${props.item.previewImageLink}/lesson-${props.item.order}.webp`} alt="Lesson" onError={handleImageError} />}
        </div>
        <div className="col-6">
          <p className="display-6">Lesson {props.item.order}. {props.item.title}</p>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Lesson {props.item.order}. {props.item.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.item.status === "unlocked" && <video ref={videoRef} width='100%' controls />}
          {props.item.status === "unlocked" && <div><b>Video speed:</b> {playbackSpeed}x. To change speed use A and S keys.</div>}
          {props.item.status === "locked" && <div className="alert alert-danger" role="alert">This video is locked!</div>}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Lesson;
