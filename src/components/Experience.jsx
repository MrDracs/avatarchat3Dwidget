import { ContactShadows, Environment, Text } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber"; // Import useThree

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const { cameraZoomed } = useChat();
  const { camera } = useThree(); // Access the camera from useThree

  useEffect(() => {
    // Set a fixed camera position at the beginning
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1.5, 0);
  }, [camera]);

  useEffect(() => {
    if (cameraZoomed) {
      camera.position.set(0, 1.5, 1.5); // Zoomed-in position
      camera.lookAt(0, 1.5, 0);
    } else {
      camera.position.set(0, 2.2, 5); // Default position
      camera.lookAt(0, 1, 0);
    }
  }, [cameraZoomed, camera]);

  return (
    <>
      <Environment preset="sunset" />
      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      <Avatar />
      <ContactShadows opacity={0.7} />
    </>
  );
};
