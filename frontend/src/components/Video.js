import React, { useState, useRef, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import c from "./Video.module.css";
import { Peer } from "simple-peer";

const Video = () => {
  const [userId, setUserId] = useState();
  const [reciever, setReciever] = useState();
  const [stream, setStream] = useState();
  const [calling, setCalling] = useState(false);
  const myVideo = useRef();
  const incommingVideo = useRef();

  const socket = useMemo(() => {
    return io("http://localhost:3000", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", function (event) {
      socket.emit("unload", userId);
    });
    socket.on("me", (userId) => {
      setUserId(userId);
    });
  }, [socket, userId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
        myVideo.current.addEventListener("loadedmetadata", () => {
          myVideo.current.play();
          myVideo.current.muted = true;
        });
      });
  }, []);

  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on("user-connected", (userId) => {
    console.log(userId);
  });

  socket.on("found-one", (userId) => {
    setReciever(userId);
  });

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: userId,
      });
    });
    peer.on("stream", (stream) => {
      incommingVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCalling(true);
      peer.signal(signal);
    });

    // connectionRef.current = peer;
  };

  const answerCall = () => {
    setCalling(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: reciever });
    });
    peer.on("stream", (stream) => {
      incommingVideo.current.srcObject = stream;
    });

    // peer.signal(callerSignal);
    peer.signal(reciever);
    // connectionRef.current = peer;
  };
  socket.on("make-call", (userId) => {
    console.log("made call", userId);
    callUser(userId);
  });

  socket.on("recieve-call", (userId) => {
    console.log("recieve call", userId);

    setReciever(userId);
    answerCall(userId);
  });

  const handleSearch = () => {
    socket.emit("find-someone", userId);
  };
  return (
    <>
      <div className={c.container}>
        <video ref={myVideo} className={c.video} />
        <video ref={incommingVideo} className={c.video2} />

        <button onClick={handleSearch} className={c.button}>
          {calling ? "swipe" : "search"}
        </button>
      </div>
      {/* <input type="text" ref={textRef} /> */}
    </>
  );
};

export default Video;
