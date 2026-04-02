//src/components/models/BB8.jsx
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function BB8({ onAnimationReady, interactiveHandlers = {}, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/bb8.glb");
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const clip = animations?.[0];
    const action = clip ? actions?.[clip.name] : null;

    if (!clip || !action) return;

    action.reset();
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(1);
    action.play();

    onAnimationReady?.({
      action,
      clip,
      mixer,
    });

    return () => {
      action.stop();
    };
  }, [actions, animations, mixer, onAnimationReady]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.694}
        >
          <group
            name="3924ee77ba9a46c58a2abc9fdcf9971cfbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="BB8BB8" scale={0.004}>
                  <group name="BB8Center_NeutralPose" position={[0, 62, 0]}>
                    <group name="BB8Center">
                      <group name="BB8BB8_Body">
                        <mesh
                          {...interactiveHandlers}
                          name="BB8BB8_Body_Scene_Material_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Body_Scene_Material_0.geometry}
                          material={materials.Scene_Material}
                        />
                        <mesh
                          {...interactiveHandlers}
                          name="BB8BB8_Body_Scene_Material_0_1"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Body_Scene_Material_0_1.geometry}
                          material={materials.Scene_Material}
                        />
                      </group>

                      <group name="BB8Hatch_Door">
                        <mesh
                          {...interactiveHandlers}
                          name="BB8Hatch_Door_Scene_Material_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8Hatch_Door_Scene_Material_0.geometry}
                          material={materials.Scene_Material}
                        />
                      </group>
                    </group>
                  </group>

                  <group name="BB8Center_Head_NeutralPose" position={[0, 62, 0]}>
                    <group name="BB8Center_Head">
                      <group name="BB8Antena">
                        <mesh
                          {...interactiveHandlers}
                          name="BB8Antena_Scene_Material1_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8Antena_Scene_Material1_0.geometry}
                          material={materials.Scene_Material1}
                        />
                      </group>

                      <group name="BB8BB8_Head">
                        <mesh
                          {...interactiveHandlers}
                          name="BB8BB8_Head_Scene_Material1_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Head_Scene_Material1_0.geometry}
                          material={materials.Scene_Material1}
                        />
                        <mesh
                          {...interactiveHandlers}
                          name="BB8BB8_Head_Scene_Material1_0_1"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8BB8_Head_Scene_Material1_0_1.geometry}
                          material={materials.Scene_Material1}
                        />
                      </group>

                      <group name="BB8Eye">
                        <mesh
                          {...interactiveHandlers}
                          name="BB8Eye_Eye_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.BB8Eye_Eye_0.geometry}
                          material={materials.material}
                        />
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/bb8.glb");