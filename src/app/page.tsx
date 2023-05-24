"use client";

import Image from 'next/image';
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import {drawRect} from "./draw"; 

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const initialise = async () => {
    const box = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json');

    const model = await tf.loadGraphModel('https://objectstorage.ap-singapore-1.oraclecloud.com/n/ax7maqnmi2u7/b/project-polish-asl/o/model.json');
    
    setInterval(() => {
      detect(model, box);
    }, 100.0);
  };

  const detect = async (model, box) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current!.width = videoWidth;
      canvasRef.current!.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [28,28])
      const greyscaled = resized.mean(2).toFloat().expandDims(0).expandDims(-1)
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const lines = await box.executeAsync(expanded)
      const obj = await model.executeAsync(greyscaled)

      const scores = await obj.array();
      const boxes = await lines[1].array()
      // const classes = await obj[2].array()
      // const scores = await obj[4].array()
      
      const ctx = canvasRef.current!.getContext("2d");

      requestAnimationFrame(()=>{drawRect(boxes[0], scores[0], videoWidth, videoHeight, ctx)}); 

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(greyscaled)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(lines)
      tf.dispose(obj)

    }
  };

  useEffect(()=>{initialise()},[]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://smubia.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/smubia.png"
              alt="Vercel Logo"
              // className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <Webcam
        ref={webcamRef}
        muted={true} 
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: 640,
          height: 480,
        }}
      />
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
  );
}

export default App;