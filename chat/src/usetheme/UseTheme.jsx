import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext.jsx";

export const useTheme = () => useContext(ThemeContext);
