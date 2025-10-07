import { CssBaseline } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import AreaDetail from "./pages/AreaDetail";
import NearestRefDetail from "./pages/NearestRefDetail";
import RouteDetail from "./pages/RouteDetail";
import RoutesPage from "./pages/RoutesPage";
// ...existing code...
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import { useMemo, useState } from "react";
// ...existing code...

function App() {
  const [dark, setDark] = useState(true);
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: dark ? "dark" : "light", primary: { main: "#1976d2" } },
        components: {
          MuiDataGrid: {
            styleOverrides: {
              root: { border: "none" }
            }
          }
        }
      }),
    [dark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
        <header style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Climb Manager</h1>
          </Link>
          <IconButton onClick={() => setDark(d => !d)} size="small">
            {dark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </header>
        <Routes>
          <Route path="/" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetail />} />
          <Route path="/areas/:id" element={<AreaDetail />} />
          <Route path="/nearest-refs/:id" element={<NearestRefDetail />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
// ...existing code...