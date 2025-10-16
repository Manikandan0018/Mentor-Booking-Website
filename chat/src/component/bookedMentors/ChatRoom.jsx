import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import { motion } from "framer-motion";
import { Mic, Send, Smile, Phone, PhoneOff } from "lucide-react";
import heroBg from "../../image/background1.png";

const socket = io(import.meta.env.VITE_BACKEND_URL); // adjust URL in production
let peerConnection;

const pcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // add TURN if needed for real-world NATs
};

const ChatRoom = () => {
  const location = useLocation();
  const { mentorId, userId, mentorName, mentorImage, userName, userImage } =
    location.state;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunks = useRef([]);
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const scrollRef = useRef();
  const typingTimeoutRef = useRef();

  // ------- helper: robust sender check -------
  const isSenderMe = (msg) => {
    if (!msg?.senderId) return false;
    if (typeof msg.senderId === "string")
      return msg.senderId === String(userId);
    if (msg.senderId?._id) return String(msg.senderId._id) === String(userId);
    return String(msg.senderId) === String(userId);
  };

  // ---------------- WebRTC VOICE CALL (start) ----------------
  const startVoiceCall = async () => {
    try {
      setInCall(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      localAudioRef.current.srcObject = stream;

      peerConnection = new RTCPeerConnection(pcConfig);

      // add audio tracks
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      // remote audio
      peerConnection.ontrack = (event) => {
        if (remoteAudioRef.current)
          remoteAudioRef.current.srcObject = event.streams[0];
      };

      // ICE candidate -> send to other peer
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) socket.emit("candidate", event.candidate);
      };

      // create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", offer);
    } catch (err) {
      console.error("startVoiceCall err:", err);
      setInCall(false);
    }
  };

  const endCall = () => {
    try {
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      socket.emit("endCall");
    } catch (err) {
      console.warn("endCall:", err);
    } finally {
      setInCall(false);
    }
  };

  // ---------------- Socket: initial setup & history ----------------
  useEffect(() => {
    socket.emit("userOnline", userId);
    socket.emit("joinRoom", { mentorId, userId });

    // receive saved/live messages from server
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      // scroll to bottom
      setTimeout(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    });

    // typing indicator
    socket.on("displayTyping", ({ senderId, isTyping }) => {
      // only show if the typing event is from the other person
      if (String(senderId) !== String(userId)) setTyping(Boolean(isTyping));
    });

    socket.on("updateOnlineStatus", (onlineMap) => {
      setOnlineUsers(onlineMap || {});
    });

    // fetch chat history (server should return messages array)
    fetch( `${import.meta.env.VITE_BACKEND_URL}/api/chat/${mentorId}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data || []);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          60
        );
      })
      .catch((err) => console.error("fetch chat history err:", err));

    return () => {
      socket.off("receiveMessage");
      socket.off("displayTyping");
      socket.off("updateOnlineStatus");
      // ensure typing stopped
      socket.emit("typing", {
        mentorId,
        userId,
        senderId: userId,
        isTyping: false,
      });
    };
  }, [mentorId, userId]);

  // ---------------- WebRTC Signaling event handlers (answer/candidate/offer) ----------------
  useEffect(() => {
    socket.on("offer", async (offer) => {
      try {
        peerConnection = new RTCPeerConnection(pcConfig);

        peerConnection.ontrack = (event) => {
          if (remoteAudioRef.current)
            remoteAudioRef.current.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) socket.emit("candidate", event.candidate);
        };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;
        localAudioRef.current.srcObject = stream;
        stream.getTracks().forEach((t) => peerConnection.addTrack(t, stream));

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", answer);
        setInCall(true);
      } catch (err) {
        console.error("handle offer err:", err);
      }
    });

    socket.on("answer", async (answer) => {
      try {
        if (peerConnection)
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
      } catch (err) {
        console.error("handle answer err:", err);
      }
    });

    socket.on("candidate", async (candidate) => {
      try {
        if (peerConnection)
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("candidate add err:", err);
      }
    });

    socket.on("endCall", () => {
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setInCall(false);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      socket.off("endCall");
    };
  }, []);

  // ---------------- TEXT send & typing (debounced) ----------------
  const emitTyping = (isTyping) => {
    socket.emit("typing", { mentorId, userId, senderId: userId, isTyping });
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    // immediately tell other side you're typing
    emitTyping(true);

    // clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // after 1200ms of no typing -> emit false
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!text.trim()) return;

    // send to server; server will save and broadcast to both peers
    socket.emit("sendMessage", {
      mentorId,
      userId,
      senderId: userId,
      text,
      type: "text",
    });

    // stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    emitTyping(false);

    setText("");
    // server will emit receiveMessage -> appended in socket.on('receiveMessage')
  };

  // ---------------- VOICE RECORDING (MediaRecorder) ----------------
  const startRecording = async () => {
    try {
      // reset
      audioChunks.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // choose a supported mimeType
      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options.mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        options.mimeType = "audio/ogg;codecs=opus";
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, {
          type: recorder.mimeType || "audio/webm",
        });
        audioChunks.current = [];

        const reader = new FileReader();
        reader.onload = () => {
          // send voice message as base64 data URL; server should save and broadcast
          socket.emit("sendMessage", {
            mentorId,
            userId,
            senderId: userId,
            type: "voice",
            voiceUrl: reader.result,
          });
        };
        reader.readAsDataURL(blob);

        // stop tracks to release mic
        try {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
          }
        } catch (err) {
          console.warn("stop tracks err:", err);
        }
      };

      recorder.start();
      setRecording(true);
      // show local mic wave? we set local audio preview muted:
      localAudioRef.current.srcObject = stream;
      localAudioRef.current.muted = true;
    } catch (err) {
      console.error("startRecording err:", err);
    }
  };

  const stopRecording = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error("stopRecording err:", err);
    } finally {
      setRecording(false);
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (peerConnection) peerConnection.close();
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        // ensure typing cleared
        socket.emit("typing", {
          mentorId,
          userId,
          senderId: userId,
          isTyping: false,
        });
      } catch (err) {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="min-h-screen relative font-sans flex justify-center items-start py-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl w-full mx-auto relative mb-5 border rounded-2xl shadow-lg flex flex-col h-[85vh] bg-white overflow-hidden ">
          {" "}
          {/* Header */}
          <div className="flex items-center  justify-between px-4  border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <img
                src={mentorImage}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold">{mentorName}</h2>
                <span
                  className={`text-sm ${
                    onlineUsers[mentorId] ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {onlineUsers[mentorId] ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {!inCall ? (
                <button
                  onClick={startVoiceCall}
                  className="p-2 bg-green-500 text-white rounded-full"
                >
                  <Phone size={18} />
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <PhoneOff size={18} />
                </button>
              )}
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, idx) => {
              const isMe = isSenderMe(msg);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${
                    isMe ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  {!isMe && (
                    <img
                      src={mentorImage}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  {msg.type === "voice" ? (
                    <audio
                      controls
                      src={msg.voiceUrl}
                      className="w-40 rounded-xl bg-white shadow-sm"
                    />
                  ) : (
                    <div
                      className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                        isMe
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {typing && (
              <motion.div
                className="flex items-center gap-2 text-gray-500 italic "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100">
                  <motion.span
                    className="w-2 h-2 bg-gray-500 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-gray-500 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: 0.15,
                    }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-gray-500 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            <div ref={scrollRef} />
          </div>
          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t bg-white relative">
            <button onClick={() => setShowEmoji((s) => !s)}>
              <Smile className="text-gray-500" />
            </button>

            {showEmoji && (
              <div className="absolute bottom-16 left-4 z-50">
                <Picker
                  onEmojiClick={(e) => setText((p) => p + e.emoji)}
                  theme="light"
                />
              </div>
            )}

            <input
              value={text}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {recording ? (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white p-2 rounded-full"
              >
                ⏹️
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="bg-gray-200 text-gray-700 p-2 rounded-full"
              >
                <Mic size={18} />
              </button>
            )}

            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
          <audio
            ref={localAudioRef}
            autoPlay
            muted
            style={{ display: "none" }}
          />
          <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
