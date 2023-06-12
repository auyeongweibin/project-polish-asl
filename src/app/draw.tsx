import * as tf from "@tensorflow/tfjs";

// Define our labels
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']

export const drawRect = async (boxes: Array<Array<number>>, scores: Array<Array<number>>, threshold: number, imgWidth: number, imgHeight: number, ctx: any)=>{

  const maxScores = scores.map(row => Math.max(...row))

  const result = await tf.image.nonMaxSuppressionWithScoreAsync(boxes, maxScores, 1, 0.45, threshold);

  let index: number = result['selectedIndices'].dataSync()[0];;
  let score: number = result['selectedScores'].dataSync()[0];
  let character : string = alphabet[scores[index].indexOf(Math.max(...scores[index]))];

  // Extract variables
  const [x,y,height,width] = boxes[index];

  // Set styling
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 2
  ctx.fillStyle = 'white'
  ctx.font = '30px Arial'   
  
  // DRAW!!
  ctx.beginPath()
  ctx.fillText(character + "-" + score, x*imgWidth/384-width*imgWidth/384, y*imgHeight/384-height*imgHeight/384-10)
  ctx.rect(x*imgWidth/384-width*imgWidth/384, y*imgHeight/384-height*imgHeight/384, width*imgWidth/192, height*imgHeight/192);
  ctx.stroke()
}