// Define our labels
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']

// Define a drawing function
export const drawRect = (boxes, scores, imgWidth, imgHeight, ctx)=>{
    if (boxes && scores.reduce((a, b) => a + b) == 1) {
        // Extract variables
        const [y,x,height,width] = boxes[0]
        const character = alphabet[scores.indexOf(1)]
        
        // Set styling
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 2
        ctx.fillStyle = 'white'
        ctx.font = '30px Arial'         
        
        // DRAW!!
        ctx.beginPath()
        ctx.fillText(character, x*imgWidth+10, y*imgHeight+30)
        ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
        ctx.stroke()
    }
}