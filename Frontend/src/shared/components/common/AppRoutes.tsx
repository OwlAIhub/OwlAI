import React from "react";
import { Routes, Route } from "react-router-dom";

interface AppRoutesProps {
  children?: React.ReactNode;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ children }) => {
  return <Routes>{children}</Routes>;
};
