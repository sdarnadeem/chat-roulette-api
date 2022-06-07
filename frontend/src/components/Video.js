import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import c from "./Video.module.css";

const Video = () => {
  const [userId, setUserId] = useState();
  const [calling, setCalling] = useState(false);
  const videoRef = useRef();
  const videoRef2 = useRef();
  const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });

  useEffect(() => {
    window.addEventListener("beforeunload", function (event) {
      socket.emit("unload", userId);
    });
  }, [socket, userId]);

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

  socket.on("user-connected", (userId) => {
    console.log(userId);
  });

  socket.on("me", (userId) => {
    setUserId(userId);
  });

  const handleSearch = () => {
    // const text = textRef.current.value;
    // socket.emit("find-someone", userId);
  };
  return (
    <>
      <div className={c.container}>
        <video ref={videoRef} className={c.video} />
        <video ref={videoRef2} className={c.video2} />

        <button onClick={handleSearch} className={c.button}>
          {calling ? "swipe" : "search"}
        </button>
      </div>
      {/* <input type="text" ref={textRef} /> */}
    </>
  );
};

export default Video;
