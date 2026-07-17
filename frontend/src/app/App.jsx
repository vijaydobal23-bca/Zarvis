import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import { setLoading } from "../features/auth/auth.slice";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);


const App = () => {
  const { handleGetMe } = useAuth();
  useEffect( () => {
     handleGetMe();
  }, []);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
