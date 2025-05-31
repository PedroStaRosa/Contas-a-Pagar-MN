import { useLocation, useNavigate } from "react-router-dom";

export function useRedirectAfterLogin(defaultPath = "/dashboard") {
  const navigate = useNavigate();
  const location = useLocation();

  /*   const from =
    (location.state as { from?: { from?: string } })?.from ||
    defaultPath ||
    localStorage.getItem("@lastProtectedRoute"); */

  const from =
    (location.state as { from?: string })?.from ||
    localStorage.getItem("@lastProtectedRoute") ||
    defaultPath;

  function redirect() {
    navigate(from, { replace: true });
  }

  return { redirect, from };
}
