"use client";

import Image from 'next/image';
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; 
import {detectVideo} from "./utils/draw"; 

export default function Detect() {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let model: any = null;

  const initialise = async () => {

    navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
          },
        })
        .then((stream) => {
          cameraRef.current!.srcObject = stream;
        });
    
    cameraRef.current!.style.display = "block"

    model = await tf.loadGraphModel('https://objectstorage.ap-singapore-1.oraclecloud.com/n/ax7maqnmi2u7/b/project-polish-asl/o/model.json');
  };

  useEffect(()=>{initialise()},[]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-10 left-0 flex w-full items-end justify-center">
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
      <video
        autoPlay
        muted
        ref={cameraRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 1280,
          height: 720,
        }}
        onPlay={() => detectVideo(cameraRef.current, model, canvasRef.current)}
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
          width: 1280,
          height: 720,
        }}
      />
    </main>
  );
}