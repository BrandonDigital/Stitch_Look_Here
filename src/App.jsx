// import * as THREE from 'three'
import React, { Suspense, useRef, useState } from "react";
import { Canvas, useThree, useRender, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Character from "./Character";
import { getMousePos } from "./utils";

extend({ OrbitControls });
const Controls = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
  useRender(() => ref.current.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

function Plane({ ...props }) {
  return (
    <mesh {...props} receiveShadow>
      <planeGeometry attach="geometry" args={[5000, 5000, 1, 1]} />
      <meshLambertMaterial
        attach="material"
        color="#272727"
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}
const d = 8.25;

export default function App() {
  const [mousePosition, setMousePosition] = useState({});
  return (
    <>
      <div className="bg" />
      <Canvas
        onMouseMove={e => setMousePosition(getMousePos(e))}
        shadowMap
        pixelRatio={window.devicePixelRatio}
        camera={{ position: [0, -3, 30] }}
        gl2
      >
        <hemisphereLight
          skyColor={"black"}
          groundColor={0xffffff}
          intensity={0.68}
          position={[0, 50, 0]}
        />
        <directionalLight
          position={[-8, 12, 8]}
          shadowCameraLeft={d * -1}
          shadowCameraBottom={d * -1}
          shadowCameraRight={d}
          shadowCameraTop={d}
          shadowCameraNear={0.1}
          shadowCameraFar={1500}
          castShadow
        />
        <Plane rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -11, 0]} />
        <Suspense fallback={null}>
          <Character
            mousePosition={mousePosition}
            position={[0, -11, 0]}
            scale={[7, 7, 7]}
          />
        </Suspense>
        <Controls
          dampingFactor={0.5}
          rotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="layer" />
    </>
  );
}
