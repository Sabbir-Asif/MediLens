import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import SignIn from "./Pages/SIgnIn";
import SignUp from "./Pages/SIgnUp";
import ForgotPassword from "./Pages/ForgotPassword";
import LandingPage from "./Pages/LandingPage";
import ErrorPage from "./Pages/ErrorPage";
import AuthProvider from "./Components/Authentication/AuthProvider";
import IntegratedOcrChatbot from "./Components/ChatBot/IntegratedOcrChatbot";
import Banner from "./Components/Banner/Banner";
import Home from "./Pages/Home";
import ChatList from "./Components/ChatBot/ChatList";
import ChatDetails from "./Components/ChatBot/ChatDeails";


const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignIn />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/forget-password',
    element: <ForgotPassword />
  },
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "banner",
        element: <Banner />
      },
      {
        path: "new-chat",
        element: <IntegratedOcrChatbot />
      },
      {
        path: 'chats',
        element: <ChatList />
      },
      {
        path: 'chat/:chatId',
        element: <ChatDetails />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </AuthProvider>
);
