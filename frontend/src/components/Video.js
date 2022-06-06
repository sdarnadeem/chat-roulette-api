import React, { useRef, useEffect } from "react";
import { io } from "socket.io-client";
import c from "./Video.module.css";

const Video = () => {
  const videoRef = useRef();
  const textRef = useRef();
  const socket = io("http://localhost:3000");

  useEffect(() => {
    window.addEventListener("beforeunload", function (event) {
      socket.emit("disconnect", "userid");
    });
  }, [socket]);

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

  const handleSearch = () => {
    const text = textRef.current.value;
    socket.emit("find-someone", text);
  };
  return (
    <>
      <div className={c.container}>
        <video ref={videoRef} className={c.video} />

        <button onClick={handleSearch} className={c.button}>
          search
        </button>
      </div>
      <input type="text" ref={textRef} />
    </>
  );
};

export default Video;
