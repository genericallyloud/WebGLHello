///<reference path="webgl-utils.ts"/>
module HELLO {
    export function main(){
        var canvas = addCanvas();
        // Get the rendering context for WebGL
        var gl = getWebGLContext(canvas);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        example1(gl);
//        example2(gl);
    }
        
    function addCanvas():HTMLCanvasElement{
        var canvas = document.createElement("canvas");
        canvas.setAttribute("screencanvas", "1");
        var width = window.innerWidth,
            height = window.innerHeight
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        return canvas;
    }
    
    function initShaders(gl,exampleNum:number){
        // setup GLSL program
        var vertexShader = createShaderFromScriptElement(gl, "example" + exampleNum + "-vertex-shader");
        var fragmentShader = createShaderFromScriptElement(gl, "example" + exampleNum + "-fragment-shader");
        var program = createProgram(gl, [vertexShader, fragmentShader]);
        gl.useProgram(program);
    }
    
    function example1(gl){
        // Set clear color
        gl.clearColor(0.1, 0.4, 0.4, 1.0);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    
    function example2(gl){
        initShaders(gl,2);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

