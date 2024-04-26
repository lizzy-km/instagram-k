import { useRef } from "react";

const VideoPlayer = () => {
    const videoSrc = '/src/HomeFeed/Components/assets/Story_Video.mp4'
    const videoRef = useRef(null);
  
    const handleLoadedMetadata = () => {
      const video = videoRef.current;
        const duration = video.duration;
        const width = video.videoWidth;
        const height = video.videoHeight;
        console.log('Video duration:', duration, 'seconds');
        console.log('Video dimensions:', width, 'x', height);
        console.log(video);
        console.log('Browser can play the video:', video.canPlayType(videoSrc));

      if (video.error) {
        console.error('Video error:', video.error.code, video.error.message);
        // Handle the error here
      }
    };
  
    const handleError = (error) => {
        console.error('Video error:', error);
        if (error.code === MEDIA_ERR_NETWORK) {
          // Potentially offline scenario (further checks might be needed)
          console.log('Video playback failed. Might be offline.');
        }
      };
      
    return (
      <div>
        <h2>Video Player</h2>
        <video ref={videoRef}  src={videoSrc} controls onError={handleError}  onPlaying={handleLoadedMetadata} />
      </div>
    );
  };
  
  export default VideoPlayer