'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraController() {
  const controlsRef = useRef<any>(null)
  const { camera, gl } = useThree()

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      zoomSpeed={0.6}
      panSpeed={0.8}
      rotateSpeed={0.4}
      minDistance={5}
      maxDistance={50}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      autoRotate={false}
      autoRotateSpeed={0.5}
      dampingFactor={0.05}
      enableDamping={true}
      target={[0, 0, 0]}
    />
  )
}