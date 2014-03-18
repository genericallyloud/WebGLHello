var HELLO;
(function (HELLO) {
    var useLogs = true;

    function log(msg) {
        if (useLogs && window.console && window.console.log) {
            window.console.log(msg);
        }
    }

    function error(msg) {
        if (useLogs && window.console) {
            if (window.console.error) {
                window.console.error(msg);
            } else if (window.console.log) {
                window.console.log(msg);
            }
        }
    }

    function loggingOff() {
        useLogs = false;
    }

    function isInIFrame() {
        return window != window.top;
    }

    function glEnumToString(gl, value) {
        for (var p in gl) {
            if (gl[p] == value) {
                return p;
            }
        }
        return "0x" + value.toString(16);
    }

    function makeFailHTML(msg) {
        return '' + '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' + '<td align="center">' + '<div style="display: table-cell; vertical-align: middle;">' + '<div style="">' + msg + '</div>' + '</div>' + '</td></tr></table>';
    }
    ;

    var GET_A_WEBGL_BROWSER = '' + 'This page requires a browser that supports WebGL.<br/>' + '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

    var OTHER_PROBLEM = '' + "It doesn't appear your computer can support WebGL.<br/>" + '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

    function setupWebGL(canvas, opt_attribs) {
        var showLink = function (str) {
            var container = canvas.parentNode;
            if (container) {
                container.innerHTML = makeFailHTML(str);
            }
        };

        if (!("WebGLRenderingContext" in window)) {
            showLink(GET_A_WEBGL_BROWSER);
            return null;
        }

        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            showLink(OTHER_PROBLEM);
        }
        return context;
    }

    function create3DContext(canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try  {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch (e) {
            }
            if (context) {
                break;
            }
        }
        return context;
    }

    function updateCSSIfInIFrame() {
        if (isInIFrame()) {
            document.body.className = "iframe";
        }
    }
    HELLO.updateCSSIfInIFrame = updateCSSIfInIFrame;
    ;

    function getWebGLContext(canvas) {
        var gl = setupWebGL(canvas);
        return gl;
    }
    HELLO.getWebGLContext = getWebGLContext;
    ;

    function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
        var errFn = opt_errorCallback || error;

        var shader = gl.createShader(shaderType);

        gl.shaderSource(shader, shaderSource);

        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var lastError = gl.getShaderInfoLog(shader);
            errFn("*** Error compiling shader '" + shader + "':" + lastError);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function createProgram(gl, shaders, opt_attribs, opt_locations) {
        var program = gl.createProgram();
        for (var ii = 0; ii < shaders.length; ++ii) {
            gl.attachShader(program, shaders[ii]);
        }
        if (opt_attribs) {
            for (var ii = 0; ii < opt_attribs.length; ++ii) {
                gl.bindAttribLocation(program, (opt_locations ? opt_locations[ii] : ii), opt_attribs[ii]);
            }
        }
        gl.linkProgram(program);

        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var lastError = gl.getProgramInfoLog(program);
            error("Error in program linking:" + lastError);

            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    HELLO.createProgram = createProgram;

    function createShaderFromScriptElement(gl, scriptId, opt_shaderType, opt_errorCallback) {
        var shaderType;
        var shaderScript = document.getElementById(scriptId);
        if (!shaderScript) {
            throw ("*** Error: unknown script element" + scriptId);
        }
        var shaderSource = shaderScript.text;

        if (!opt_shaderType) {
            if (shaderScript.type == "x-shader/x-vertex") {
                shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type == "x-shader/x-fragment") {
                shaderType = gl.FRAGMENT_SHADER;
            } else if (shaderType != gl.VERTEX_SHADER && shaderType != gl.FRAGMENT_SHADER) {
                throw ("*** Error: unknown shader type");
                return null;
            }
        }

        return loadShader(gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType, opt_errorCallback);
    }
    HELLO.createShaderFromScriptElement = createShaderFromScriptElement;

    HELLO.requestAnimFrame = (function () {
        return window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || function (callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();

    HELLO.cancelRequestAnimFrame = (function () {
        return window["cancelRequestAnimationFrame"] || window["webkitCancelRequestAnimationFrame"] || window["mozCancelRequestAnimationFrame"] || window["oCancelRequestAnimationFrame"] || window.clearTimeout;
    })();
})(HELLO || (HELLO = {}));
var HELLO;
(function (HELLO) {
    function main() {
        var canvas = addCanvas();

        var gl = HELLO.getWebGLContext(canvas);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        example1(gl);
    }
    HELLO.main = main;

    function addCanvas() {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("screencanvas", "1");
        var width = window.innerWidth, height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        return canvas;
    }

    function initShaders(gl, exampleNum) {
        var vertexShader = HELLO.createShaderFromScriptElement(gl, "example" + exampleNum + "-vertex-shader");
        var fragmentShader = HELLO.createShaderFromScriptElement(gl, "example" + exampleNum + "-fragment-shader");
        var program = HELLO.createProgram(gl, [vertexShader, fragmentShader]);
        gl.useProgram(program);
    }

    function example1(gl) {
        gl.clearColor(0.1, 0.4, 0.4, 1.0);

        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    function example2(gl) {
        initShaders(gl, 2);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
})(HELLO || (HELLO = {}));
