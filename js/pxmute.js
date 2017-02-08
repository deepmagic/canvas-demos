/*  Pixel Transmute - for 2d canvas context 

*/

function PxMute(ctx) { 
    this.ctx = ctx; 
    this.col = 4;
    this.h = ctx.canvas.height;
    this.w = this.row = ctx.canvas.width*this.col;
}
PxMute.prototype = {
    //basic
    copy:function(indata) {
        this.copy.out = this.copy.out || this.ctx.createImageData(indata.width, indata.height);
        len = indata.data.length,
        od = this.copy.out.data, id = indata.data;
        for(var i = 0; i < len; i+=4) { 
            //this gets faster with more static assignments
            od[i  ] = id[i  ]; 
            od[i+1] = id[i+1]; 
            od[i+2] = id[i+2]; 
            od[i+3] = id[i+3]; 
        }
        return this.copy.out;
    },
    alpha:function(indata, alpha) {
        var out = this.ctx.createImageData(indata.width, indata.height);
        var len = indata.data.length;
        for(var i = 0;i < len;i+=4) {
            out.data[i  ] = indata.data[i  ];
            out.data[i+1] = indata.data[i+1];
            out.data[i+2] = indata.data[i+2];
            out.data[i+3] = alpha;
        }
        return out;
    },
    invert:function(indata) {
        var out = this.ctx.createImageData(indata.width, indata.height);
        var len = indata.data.length;
        for(var i = 0; i < len; i+=4) {
            out.data[i  ] = 255-indata.data[i  ];
            out.data[i+1] = 255-indata.data[i+1];
            out.data[i+2] = 255-indata.data[i+2];
            out.data[i+3] = indata.data[i+3];
        }
        return out;
    },
    brightness:function(indata, delta) {
        var out = this.ctx.createImageData(indata.width, indata.height);
        var len = indata.data.length;
        for(var i = 0; i < len; i+=4) {
            out.data[i  ] = indata.data[i  ]+delta;
            out.data[i+1] = indata.data[i+1]+delta;
            out.data[i+2] = indata.data[i+2]+delta;
            out.data[i+3] = indata.data[i+3];
        }
        return out;
    },
    normalize:function(indata) { 
        var out = this.ctx.createImageData(indata.width, indata.height);
        var len = indata.data.length;
        for(var i = 0;i < len;i+=4) {
            var avg = (indata.data[i] + indata.data[i+1] + indata.data[i+2] )*0.33;
            out.data[i]   = avg;
            out.data[i+1] = avg;
            out.data[i+2] = avg;
            out.data[i+3] = indata.data[i+3];
        }
        return out;
    },
    thresholdAlpha:function(indata, val) { 
        var out = this.ctx.createImageData(indata.width, indata.height);
        var len = indata.data.length;
        for(var i = 0;i < len;i+=4) {
            out.data[i  ] = indata.data[i  ];
            out.data[i+1] = indata.data[i+1];
            out.data[i+2] = indata.data[i+2];
            if(indata.data[i  ] > val) {
                out.data[i+3] = indata.data[i+3];
            } else {
                out.data[i+3] = 0; //set alpha to zero
            }
        }
        return out;
    },
    add:function(pdata, qdata) {
        //if(pdata.length !== qdata.length){ throw "PixMute Subtract: inconsistent image length."; }
        this.add.out = this.add.out || this.ctx.createImageData(pdata.width, pdata.height);
        var len = pdata.data.length, od = this.add.out.data,
        pd = pdata.data, qd = qdata.data;
            
        for(var i = 0; i < len; i+=4) {
            od[i  ] = pd[i  ] + qd[i  ];
            od[i+1] = pd[i+1] + qd[i+1];
            od[i+2] = pd[i+2] + qd[i+2];
            od[i+3] = 255;
        }
        
        return this.add.out;
    },
    subtract:function(pdata, qdata) {
        //if(pdata.length !== qdata.length){ throw "PxMute Subtract: inconsistent image length."; }
        this.subtract.out = this.subtract.out || this.ctx.createImageData(pdata.width, pdata.height);
        var len = pdata.data.length, od = this.subtract.out.data,
        pd = pdata.data, qd = qdata.data;
            
        for(var i = 0; i < len; i+=4) {
            od[i  ] = pd[i  ] - qd[i  ];
            od[i+1] = pd[i+1] - qd[i+1];
            od[i+2] = pd[i+2] - qd[i+2];
            od[i+3] = 255;
        }
        
        return this.subtract.out;
    },
    //binary 
    threshold:function(indata, val) { // binary threshold
        this.threshold.out = this.threshold.out || this.ctx.createImageData(indata.width, indata.height);
        var od = this.threshold.out.data, id = indata.data,
        len = indata.data.length;
        
        for(var i = 0;i < len;i+=4) {
            if(id[i] > val ) {
                od[i  ] = 255;
                od[i+1] = 255;
                od[i+2] = 255;
                od[i+3] = 255;
            } else {
                od[i  ] = 0;
                od[i+1] = 0;
                od[i+2] = 0;
                od[i+3] = 0;
            }
        }
        return this.threshold.out;
    },
    shrink:function(indata) {   // a bit slow
        var out = this.ctx.createImageData(indata.width, indata.height);
        //this.shrink.out = this.shrink.out || this.ctx.createImageData(indata.width, indata.height);
        var od = out.data, id = indata.data;
        
        for(var y = 0; y < this.h; y++) {        
            for(var x = 0; x < this.w; x+=this.col) {   
                
                ndx = y*this.w+x;
                
                if(id[ndx - this.row - this.col] && 
                   id[ndx - this.row           ] && 
                   id[ndx - this.row + this.col] &&
                   id[ndx            - this.col] &&
                   id[ndx            + this.col] && 
                   id[ndx + this.row - this.col] && 
                   id[ndx + this.row           ] && 
                   id[ndx + this.row - this.col] ){
                    od[ndx]   = id[ndx];
                    od[ndx+1] = id[ndx+1];
                    od[ndx+2] = id[ndx+2];
                } else {
                    od[ndx]   = 
                    od[ndx+1] = 
                    od[ndx+2] = 0;
                }    
                od[ndx+3] = id[ndx+3];
            }
        }
        return out;
    },
    expand:function(indata) {   // slow
        var out = this.ctx.createImageData(indata.width, indata.height);
        //this.expand.out = this.expand.out || this.ctx.createImageData(indata.width, indata.height);
        var od = out.data, id = indata.data;
        
        for(var y = 0; y < this.h; y++) {        
            for(var x = 0; x < this.w; x+=this.col) {   
                
                ndx = y*this.w+x;
                if(id[ndx - this.row - this.col] || //or is slow evidently
                   id[ndx - this.row           ] || 
                   id[ndx - this.row + this.col] ||
                   id[ndx            - this.col] ||
                   id[ndx            + this.col] || 
                   id[ndx + this.row - this.col] ||
                   id[ndx + this.row           ] ||
                   id[ndx + this.row - this.col] ){
                    od[ndx  ] = 255;
                    od[ndx+1] = 255; 
                    od[ndx+2] = 255;
                } else {
                    od[ndx  ] = id[ndx  ];
                    od[ndx+1] = id[ndx+1];
                    od[ndx+2] = id[ndx+2];
                }
                od[ndx+3] = id[ndx+3];
            }
        }
        return out;
    },
    //filters
    blur:function(indata) { // greyscale blur
        var out = this.ctx.createImageData(indata.width, indata.height),
        ndx, col = 4,
        h = indata.height,
        w = row = indata.width*col,
        div = 0.11111; //1/9
        
         // skip first/last row/col
        for(var y = 1; y < (h-1); y++) {        
            for(var x = col; x < (w-col); x+=col) {   
            
            ndx = y*w+x;
            
            avg = (
                  indata.data[ ndx - row - col ] +
                  indata.data[ ndx - row       ] +
                  indata.data[ ndx - row + col ] +
                  indata.data[ ndx - col       ] +
                  indata.data[ ndx             ] +
                  indata.data[ ndx + col       ] +
                  indata.data[ ndx + row - col ] +
                  indata.data[ ndx + row       ] +
                  indata.data[ ndx + row + col ]) * div;
            
                out.data[ndx]   = avg;
                out.data[ndx+1] = avg;
                out.data[ndx+2] = avg;
                out.data[ndx+3] = indata.data[ndx+3];
            }
        }
        return out;
    },
    gblur:function(indata) { // guass approx blur
        var out = this.ctx.createImageData(indata.width, indata.height), 
        od = out.data, id = indata.data, ndx, div=0.0625; //1/16
        
         // skip first/last row/col
        for(var y = 1; y < (this.h-1); y++) {        
            for(var x = this.col; x < (this.w-this.col); x+=this.col) {   
            
            ndx = y*this.w+x;
            
            avg =(id[ ndx - this.row - this.col ]   +       //top left
                  id[ ndx - this.row            ]*2 +       //top mid
                  id[ ndx - this.row + this.col ]   +       //top right
                  id[ ndx - this.col            ]*2 +       //left
                  id[ ndx                       ]*4 +       //mid
                  id[ ndx + this.col            ]*2 +       //right
                  id[ ndx + this.row - this.col ]   +       //bottom left
                  id[ ndx + this.row            ]*2 +       //bottom mid
                  id[ ndx + this.row + this.col ]) * div;   //bottom right
            
                od[ndx]   = avg;
                od[ndx+1] = avg;
                od[ndx+2] = avg;
                od[ndx+3] = id[ndx+3];
            }
        }
        return out;
    },
    median:function(indata) { // 3x3 - slow
        var out = this.ctx.createImageData(indata.width, indata.height), //memoize this
            od = out.data, id = indata.data, ndx, local;
        
        for(var y = 1; y < (this.h-1); y++) {        
            for(var x = this.col; x < (this.w-this.col); x+=this.col) {   
            
                ndx = y*this.w+x;
                
                local = [
                  id[ ndx - this.row - this.col ],
                  id[ ndx - this.row            ],
                  id[ ndx - this.row + this.col ],
                  id[ ndx - this.col            ],
                  id[ ndx                       ],
                  id[ ndx + this.col            ],
                  id[ ndx + this.row - this.col ],
                  id[ ndx + this.row            ],
                  id[ ndx + this.row + this.col ] 
                ];
                
                local = local.sort(function(a,b){return a-b;})[4];
                
                od[ndx  ] = local;
                od[ndx+1] = local;
                od[ndx+2] = local;
                od[ndx+3] = 255;
            }
        }
        
        return out;
    },
    sobel:function(indata) { // uses red from rgb (assumes greyscale)
        
        //var out = this.ctx.createImageData(indata.width, indata.height); //memoize this
        this.sobel.out = this.sobel.out || this.ctx.createImageData(indata.width, indata.height);
        
        var ndx, sum, sumX, sumY,
        id = indata.data,
        od = this.sobel.out.data;
        
        // Gx = [[-1, 0, 1],
        //       [-2, 0, 2],
        //       [-1, 0, 1]];
        // Gy = [[-1,-2,-1],
        //       [ 0, 0, 0],
        //       [ 1, 2, 1]];
        
        // skip first/last row/col
        for(var y = 1; y < (this.h-1); y++) {        
            for(var x = this.col; x < (this.w-this.col); x+=this.col) {   
            
                ndx = y*this.w+x; sumX = 0; sumY = 0;
                
                //skipping zero kernel indices
                sumX = id[ ndx - this.row - this.col ] * -1 +   //Gx[0][0]
                       id[ ndx - this.row + this.col ] *  1 +   //Gx[0][2]
                       id[ ndx - this.col ]            * -2 +   //Gx[1][0]
                       id[ ndx + this.col ]            *  2 +   //Gx[1][2] 
                       id[ ndx + this.row - this.col ] * -1 +   //Gx[2][0]
                       id[ ndx + this.row + this.col ] *  1;    //Gx[2][2]
                
                sumY = id[ ndx - this.row - this.col ] * -1 +   //Gy[0][0]
                       id[ ndx - this.row ]            * -2 +   //Gy[0][1]
                       id[ ndx - this.row + this.col ] * -1 +   //Gy[0][2]
                       id[ ndx + this.row - this.col ] *  1 +   //Gy[2][0]
                       id[ ndx + this.row ]            *  2 +   //Gy[2][1]
                       id[ ndx + this.row + this.col ] *  1;    //Gy[2][2]
                
                sum = Math.abs(sumX) + Math.abs(sumY); // perf approx
                //sum = Math.sqrt( sumX*sumX + sumY*sumY );
                
                od[ ndx   ] = sum; //static assignment is faster than chained ie: x=y=z=0
                od[ ndx+1 ] = sum;
                od[ ndx+2 ] = sum;
                od[ ndx+3 ] = id[ ndx+3 ];
            }
        }
        return this.sobel.out;
    }
};

