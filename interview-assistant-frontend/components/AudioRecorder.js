import { useState, useRef } from "react";
const AudioRecorder = () => {

    // TODO: SET 30 SECOND LIMIT ---------------------------------------------

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);

    const mimeType = "audio/webm";

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
        //creates a blob file from the audiochunks data
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        //creates a playable URL from the blob file.
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setAudioChunks([]);
    };
    };

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("Media recorder is not supported in your browser.");
        }
    };
    return (
        <div className="p-16">
            <main>
                <div className="">
                    {!permission ? (
                    <button className="bg-red-600 hover:bg-red-500 text-white px-4 p-2 rounded-xl"onClick={getMicrophonePermission} type="button">
                        Get Microphone
                    </button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                    <button onClick={startRecording} type="button">
                        Start Recording
                    </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                    <button onClick={stopRecording} type="button">
                        Stop Recording
                    </button>
                    ) : null}

                    {audio ? (
                    <div className="audio-container">
                        <audio src={audio} controls></audio>
                        <a download href={audio}>
                            Download Recording
                        </a>
                    </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
};
export default AudioRecorder;