import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import c from "./Video.module.css";
import peer from "../utils/peer";

const Video = () => {
  const videoRef = useRef();
  //   const textRef = useRef();
  const socket = io("http://localhost:3000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });
  const userId = peer._id;

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

  const conn = peer.connect("another-peers-id");
  conn.on("open", () => {
    conn.send("hi!");
  });

  const handleSearch = () => {
    // const text = textRef.current.value;
    socket.emit("find-someone", userId);
  };
  return (
    <>
      <div className={c.container}>
        <video ref={videoRef} className={c.video} />

        <button onClick={handleSearch} className={c.button}>
          search
        </button>
      </div>
      {/* <input type="text" ref={textRef} /> */}
    </>
  );
};

export default Video;
