// Body for use_figma (load figma-use skill first). Pass frame node id.
// Returns {frameW, frameH, rows:[{text,x,y,w,h,fontFamily,fontSize,fontWeight,color}]}
// Filters per-character / tiny nodes (text length<2 or width<14) to drop rotated-text noise.
