import * as tf from "@tensorflow/tfjs";

// Define our labels
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']

function sortIndicesByLargestValue(arr: Array<Array<number>>) {
  // Create an array of indices
  const indices = Array.from({ length: arr.length }, (_, index) => index);

  // Sort the indices based on the largest value in each inner array
  indices.sort((a, b) => {
    const largestValueA = Math.max(...arr[a].slice(4));
    const largestValueB = Math.max(...arr[b].slice(4));
    return largestValueB - largestValueA;
  });

  return indices;
}

export const drawRect = async (boxes: Array<Array<number>>, scores: Array<Array<number>>, threshold: number, imgWidth: number, imgHeight: number, ctx: any)=>{

  const maxScores = scores.map(row => Math.max(...row))

  const result = await tf.image.nonMaxSuppressionWithScoreAsync(boxes, maxScores, 1, 0.5, threshold);

  let index: number = result['selectedIndices'].dataSync()[0];;
  let score: number = result['selectedScores'].dataSync()[0];
  let character : string = alphabet[scores[index].indexOf(Math.max(...scores[index]))];

  // Extract variables
  const [x,y,height,width] = boxes[index];
  // console.log([x,y,height,width]);
  // console.log("Character: " + character)

  // Set styling
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 2
  ctx.fillStyle = 'white'
  ctx.font = '30px Arial'   
  
  // DRAW!!
  ctx.beginPath()
  ctx.fillText(character + "-" + score, x, y-10)
  // ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/2);
  ctx.rect(x, y, width, height);
  ctx.stroke()
}