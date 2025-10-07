
import BoltIcon from "@mui/icons-material/Bolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import ForestIcon from "@mui/icons-material/Forest";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TerrainIcon from "@mui/icons-material/Terrain";
import { Box, Card, CardContent, Chip, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRoute } from "../api";

export default function RouteDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchRoute(id)
      .then(setRoute)
      .catch(e => setErr(e.message));
  }, [id]);

  const typeIconMap = {
    sport: <BoltIcon fontSize="small" />, trad: <FilterVintageIcon fontSize="small" />, alpine: <TerrainIcon fontSize="small" />, "semi-alpine": <ForestIcon fontSize="small" />
  };

  function gradeColor(grade) {
    if (!grade) return "default";
    if (/^(3|4)/.test(grade)) return "success";
    if (/^(5|6)/.test(grade)) return "info";
    if (/^(7)/.test(grade)) return "warning";
    return "error";
  }

  function prioColor(p) {
    if (p == null) return "default";
    if (p <= 2) return "success";
    if (p <= 4) return "info";
    if (p <= 6) return "warning";
    return "error";
  }

  if (err) return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography color="error" variant="h6">Error: {err}</Typography>
      <Link to="/">Back</Link>
    </Box>
  );
  if (!route) return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h6">Loading…</Typography>
    </Box>
  );

  const area = route.nearest_reference && route.nearest_reference.area && route.nearest_reference.area.name ? route.nearest_reference.area.name : "—";
  const prio = route.prio ?? route.priority ?? null;
  const done = route.done === true || route.completed === true;
  const comments = route.comments || route.note || "";

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Typography variant="h5" fontWeight={600} flex={1}>{route.name}</Typography>
            {done ? (
              <Tooltip title="Done"><CheckCircleIcon color="success" /></Tooltip>
            ) : (
              <Tooltip title="Not done"><RadioButtonUncheckedIcon sx={{ opacity: 0.4 }} /></Tooltip>
            )}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1} mb={2}>
            <Chip label={route.type || "—"} icon={typeIconMap[route.type]} size="small" />
            <Chip label={route.grade || "—"} color={gradeColor(route.grade)} size="small" variant="outlined" />
            <Chip label={prio != null ? `Prio ${prio}` : "No prio"} color={prioColor(prio)} size="small" />
            <Chip label={area} size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={1}>
            <b>Length:</b> {route.length || "—"} m
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            <b>Nearest Reference:</b> {route.nearest_reference ? route.nearest_reference.name : "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            <b>Area:</b> {area}
          </Typography>
          {comments && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Comments</Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{comments}</Typography>
            </Box>
          )}

          {Array.isArray(route.climbs) && route.climbs.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>Climbs</Typography>
              <Stack spacing={1}>
                {route.climbs.map((climb, idx) => (
                  <Card key={climb.id || idx} variant="outlined" sx={{ p: 1, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" fontWeight={500} flex={1}>
                        {climb.date ? (<>{climb.date}: </>) : null}
                        {climb.style ? (<>{climb.style} </>) : null}
                        {climb.notes ? (<Tooltip title={climb.notes}><span>📝</span></Tooltip>) : null}
                      </Typography>
                      {Array.isArray(climb.climbers) && climb.climbers.length > 0 ? (
                        <Stack direction="row" spacing={1}>
                          {climb.climbers.map((climber, cidx) => (
                            <Chip key={climber.id || cidx} label={climber.name || `Climber #${climber.id}`} size="small" color="primary" />
                          ))}
                        </Stack>
                      ) : (
                        <Chip label="Unknown climber" size="small" />
                      )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          <Box mt={2}>
            <Link to="/">← Back to all routes</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}