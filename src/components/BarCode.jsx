import { useEffect, useRef } from 'react'
import bwipjs from 'bwip-js'
import cx from 'classnames'

export default function BarCode({ code = '', className = '', ...props }) {
  const canvasRef = useRef()
  useEffect(() => {
    bwipjs.toCanvas(canvasRef.current, {
      bcid: 'code39', // Barcode type
      text: code, // Text to encode
      scale: 10, // 3x scaling factor
      height: 16, // Bar height, in millimeters
      includetext: false, // Show human-readable text
    })
  }, [])
  return (
    <canvas
      ref={canvasRef}
      id="wellcare-barcode-canvas"
      className={cx('w-full', className)}
      {...props}
    />
  )
}
