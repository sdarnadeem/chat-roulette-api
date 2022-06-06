import React from "react";
import { io } from "socket.io-client";
import c from "./Video.module.css";

const Video = () => {
  const socket = io("http://localhost:3000");
  console.log(socket);

  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  return <div className={c.container}></div>;
};

export default Video;
