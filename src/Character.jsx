import * as THREE from "three";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import { getMouseDegrees } from "./utils";

function moveJoint(mouse, joint, degreeLimit = 40) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
  joint.rotation.y = THREE.Math.degToRad(degrees.x);
  joint.rotation.x = THREE.Math.degToRad(degrees.y);
}

export default function Character(props) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, "/stacy.glb");
  const [neck, setNeck] = useState(undefined);
  const [waist, setWaist] = useState(undefined);
  const [bones, skeleton] = useMemo(() => {
    // By putting bones into the view Threejs removes it automatically from the
    // cached scene. Next time the component runs these two objects will be gone.
    // Since the gltf object is a permenently cached object, we can extend it here
    // and extend it with all the data we may need.
    if (!gltf.bones) gltf.bones = gltf.scene.children[0].children[0];
    if (!gltf.skeleton)
      gltf.skeleton = gltf.scene.children[0].children[1].skeleton;

    gltf.scene.traverse(o => {
      // Reference the neck and waist bones
      if (o.isBone && o.name === "mixamorigNeck") {
        setNeck(o);
      }
      if (o.isBone && o.name === "mixamorigSpine") {
        setWaist(o);
      }
    });
    return [gltf.bones, gltf.skeleton];
  }, [gltf]);

  const texture = useLoader(TextureLoader, "/stacy.jpg");
  const actions = useRef();
  const [mixer] = useState(() => new THREE.AnimationMixer());

  useEffect(() => {
    actions.current = {
      pockets: mixer.clipAction(gltf.animations[0], group.current),
      rope: mixer.clipAction(gltf.animations[1], group.current),
      swingdance: mixer.clipAction(gltf.animations[2], group.current),
      jump: mixer.clipAction(gltf.animations[3], group.current),
      react: mixer.clipAction(gltf.animations[4], group.current),
      shrug: mixer.clipAction(gltf.animations[5], group.current),
      wave: mixer.clipAction(gltf.animations[6], group.current),
      golf: mixer.clipAction(gltf.animations[7], group.current),
      idle: mixer.clipAction(gltf.animations[8], group.current)
    };
    actions.current.idle.play();
  }, [mixer, gltf]);

  useFrame((state, delta) => {
    mixer.update(delta);
    props.mousePosition && neck && moveJoint(props.mousePosition, neck);
    props.mousePosition && waist && moveJoint(props.mousePosition, waist);
  });

  return (
    // dispose={null} to bail out of recursive dispose here to keep the geometry
    // without this it destroys the material and the buffergeometry on unmount
    // this is a react-three-fiber@beta feature
    <group ref={group} {...props} dispose={null}>
      <object3D
        name="Stacy"
        rotation={[1.5707964611537577, 0, 0]}
        scale={[
          0.009999999776482582,
          0.009999999776482582,
          0.009999999776482582
        ]}
      >
        <primitive object={bones} />
        <skinnedMesh
          name="stacy"
          rotation={[-1.5707964611537577, 0, 0]}
          scale={[100, 100, 99.9999771118164]}
          skeleton={skeleton}
        >
          <bufferGeometry attach="geometry" {...gltf.__$[67].geometry} />
          <meshPhongMaterial attach="material" {...gltf.__$[67].material}>
            <texture attach="map" {...texture} flipY={false} />
          </meshPhongMaterial>
        </skinnedMesh>
      </object3D>
    </group>
  );
}
