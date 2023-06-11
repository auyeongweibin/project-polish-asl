"use client";

import Image from 'next/image';
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import {drawRect} from "./draw"; 

export default function Home() {
  const webcamRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initialise = async () => {

    const model = await tf.loadGraphModel('https://objectstorage.ap-singapore-1.oraclecloud.com/n/ax7maqnmi2u7/b/project-polish-asl/o/yolov8n.json');
    const net = await tf.loadGraphModel('https://livelong.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json');

    setInterval(() => {
      detect(model, net);
    }, 40.0);
  };

  const detect = async (model: any, net: any) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current['video']['readyState'] === 4 &&
      canvasRef.current !== null
    ) {
      // Get Video Properties
      const video = webcamRef.current['video'];
      const videoWidth = webcamRef.current['video']['videoWidth'];
      const videoHeight = webcamRef.current['video']['videoHeight'];

      // Set video width
      webcamRef.current['video']['width'] = videoWidth;
      webcamRef.current['video']['height'] = videoHeight;

      // Set canvas height and width
      canvasRef.current!['width'] = videoWidth;
      canvasRef.current!['height'] = videoHeight;

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [800,800]).expandDims(0);
      const obj = await model.execute(resized);

      const result = await obj.array();

      const boxes = result[0].slice(0, 4)[0].map((_: any, colIndex: any) => result[0].slice(0, 4).map(row => row[colIndex]));
      const scores = result[0].slice(4)[0].map((_: any, colIndex: any) => result[0].slice(4).map(row => row[colIndex]));
      
      const ctx = canvasRef.current.getContext('2d');

      requestAnimationFrame(()=>{drawRect(boxes, scores, 0.8, videoWidth, videoHeight, ctx)}); 

      tf.dispose(img)
      tf.dispose(resized)
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
          zIndex: 9,
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
          zIndex: 10,
          width: 640,
          height: 480,
        }}
      />
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 before:lg:h-[360px]">
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
  );
}