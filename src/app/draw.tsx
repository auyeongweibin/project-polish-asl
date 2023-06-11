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

export const drawRect = (boxes: Array<Array<number>>, scores: Array<Array<number>>, threshold: number, imgWidth: number, imgHeight: number, ctx: any)=>{

  const maxScores = scores.map(row => Math.max(...row))

  const result = tf.image.nonMaxSuppressionWithScore(boxes, maxScores, 1, 0.5, threshold)

  const index = result['selectedIndices'].arraySync();
  const score = result['selectedScores'].arraySync();
  const character = alphabet[scores[index[0]].indexOf(Math.max(...scores[index[0]]))]

  // const scores = result[0].map((_: any, colIndex: any) => result.map(row => row[colIndex]));
  // const indices = sortIndicesByLargestValue(scores);
  // for(let i=0; i<=result.length; i++){
  //   const score = scores[indices[i]].slice(4);
  //   const index = score.indexOf(Math.max.apply(null, score));
    
  //   if(score[index]>threshold){

  //       // Extract variables
  //       const [x,y,height,width] = scores[indices[i]].slice(0, 4);

  //       // Set styling
  //       ctx.strokeStyle = 'green'
  //       ctx.lineWidth = 2
  //       ctx.fillStyle = 'white'
  //       ctx.font = '30px Arial'   
        
  //       // DRAW!!
  //       ctx.beginPath()
  //       ctx.fillText(alphabet[index] + "-" + score[index], x, y-10)
  //       // ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/2);
  //       ctx.rect(x, y, width, height);
  //       ctx.stroke()
  //   } else {
  //       break;
  //   }
  // }

  // Extract variables
  const [x,y,height,width] = boxes[index[0]];

  // Set styling
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 2
  ctx.fillStyle = 'white'
  ctx.font = '30px Arial'   
  
  // DRAW!!
  ctx.beginPath()
  ctx.fillText(character + "-" + score[0], x, y-10)
  // ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/2);
  ctx.rect(x, y, width, height);
  ctx.stroke()
}