import * as tf from "@tensorflow/tfjs";

// Define our labels
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']

const modelInput:number = 384;
const imageWidth:number = 1280;
const imageHeight:number = 720

const preprocess = (source: any, modelWidth: number, modelHeight: number) => {
  const img = tf.browser.fromPixels(source);
  const [h, w] = img.shape.slice(0, 2); // get source width and height
  const maxSize = Math.max(w, h); // get max size
  const imgPadded:tf.Tensor3D = img.pad([
    [0, maxSize - h], // padding y [bottom only]
    [0, maxSize - w], // padding x [right only]
    [0, 0],
  ]);

  const resized = tf.image.resizeBilinear(imgPadded, [modelWidth,modelHeight]).expandDims(0);

  return resized
}

const postprocess = (output: any, maxBoxes: number, iouThreshold: number, probThreshold: number) => {
  const data = tf.tidy(() => output.transpose([0, 2, 1]).squeeze()).arraySync(); // transpose main result
  const numPreds = data.length;
  let boxes:Array<Array<number>> = [];
  for (let i=0;i<numPreds;i++) {
    const scores = data[i].slice(4)
    const prob = Math.max.apply(null, scores);
    if (prob < probThreshold) {
      continue;
    }
    const label = scores.indexOf(prob);
    const xc = data[i][0];
    const yc = data[i][1];
    const w = data[i][2];
    const h = data[i][3];
    // const x1 = (xc-w/2)/modelInput*imageWidth;
    // const y1 = (yc-h/2)/modelInput*imageHeight;
    // const x2 = (xc+w/2)/modelInput*imageWidth;
    // const y2 = (yc+h/2)/modelInput*imageHeight;
    const x1 = (xc)/modelInput*imageWidth;
    const y1 = (yc)/modelInput*imageHeight;
    const x2 = (xc+w)/modelInput*imageWidth;
    const y2 = (yc+h)/modelInput*imageHeight;
    boxes.push([x1,y1,x2,y2,prob,label]);
  }
  boxes = boxes.sort((box1,box2) => box2[5]-box1[5]);
  const result = [];
  while (boxes.length>0) {
      result.push(boxes[0]);
      boxes = boxes.filter(box => iou(boxes[0],box)<iouThreshold);
  }

  if (result.length > maxBoxes) {
    return result.slice(0, maxBoxes + 1);
  }

  return result;
}

const union = (box1:Array<number>, box2:Array<number>) =>  {
  const [box1_x1,box1_y1,box1_x2,box1_y2] = box1;
  const [box2_x1,box2_y1,box2_x2,box2_y2] = box2;
  const box1_area = (box1_x2-box1_x1)*(box1_y2-box1_y1)
  const box2_area = (box2_x2-box2_x1)*(box2_y2-box2_y1)
  return box1_area + box2_area - intersection(box1,box2)
}

const intersection = (box1:Array<number>, box2:Array<number>) => {
  const [box1_x1,box1_y1,box1_x2,box1_y2] = box1;
  const [box2_x1,box2_y1,box2_x2,box2_y2] = box2;
  const x1 = Math.max(box1_x1,box2_x1);
  const y1 = Math.max(box1_y1,box2_y1);
  const x2 = Math.min(box1_x2,box2_x2);
  const y2 = Math.min(box1_y2,box2_y2);
  return (x2-x1)*(y2-y1)
}

const iou = (box1:Array<number>, box2:Array<number>) => {
  return intersection(box1,box2)/union(box1,box2);
}

export const detectVideo = (videoSource: any, model: any, canvasRef: any) => {
  const detect = async () => {
    if (videoSource.srcObject === null) {
      const ctx = canvasRef.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
      return; 
    } // if webcam is closed

    tf.engine().startScope(); // start scoping tf engine

    const [modelHeight, modelWidth] = model.inputs[0].shape.slice(1, 3);

    const resized = preprocess(videoSource, modelWidth, modelHeight);

    const res = model.execute(resized); // execute model
    const output = postprocess(res, 1, 0.7, 0.9);
 
    const ctx = canvasRef.getContext("2d");

    // Set styling
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 1
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'   
      
    output.forEach((r:Array<number>) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

      const [x1, y1, x2, y2, _, label] = r
      const y = Math.floor(y1)
      const x = Math.floor(x1)
      const h = Math.round(y2-y1) 
      const w = Math.round(x2-x1)
  
      // DRAW!!
      ctx.beginPath()
      ctx.fillText(alphabet[label], x, y-10);
      ctx.rect(x, y, w, h);
      ctx.stroke()
    });
    
    requestAnimationFrame(detect);
  
    tf.engine().endScope(); // end of scoping
  }

  detect();
}