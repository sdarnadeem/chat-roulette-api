import React, { useRef, useEffect } from "react";
import { io } from "socket.io-client";
import c from "./Video.module.css";

const Video = () => {
  const videoRef = useRef();
  const socket = io("http://localhost:3000");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadedmetadata", () => {
          videoRef.current.play();
          videoRef.current.muted = true;
        });
      });
  }, []);

  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  return (
    <div className={c.container}>
      <video ref={videoRef} className={c.video} />
    </div>
  );
};

export default Video;
