import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArea, fetchRoutes } from "../api";

export default function AreaDetail() {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchArea(id),
      fetchRoutes().then(allRoutes => 
        allRoutes.filter(route => 
          route.nearest_reference && 
          route.nearest_reference.area && 
          route.nearest_reference.area.id === parseInt(id)
        )
      )
    ])
    .then(([areaData, areaRoutes]) => {
      setArea(areaData);
      setRoutes(areaRoutes.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        grade: r.grade,
        prio: r.prio ?? r.priority ?? null,
        nearest: r.nearest_reference ? r.nearest_reference.name : "—",
        length: r.length ?? r.route_length ?? null,
        done: r.done === true || r.completed === true
      })));
    })
    .catch(e => setErr(e.message))
    .finally(() => setLoading(false));
  }, [id]);

  function gradeColor(grade) {
    if (!grade) return "default";
    if (/^[1-3]/.test(grade)) return "success";
    if (/^4|^5/.test(grade)) return "info";
    if (/^6/.test(grade)) return "warning";
    return "error";
  }

  function prioColor(p) {
    if (p === null) return "default";
    if (p === 1) return "success";
    if (p === 2) return "info";
    if (p === 3) return "warning";
    return "error";
  }

  const columns = [
    {
      field: "name",
      headerName: "Route Name",
      flex: 1.2,
      minWidth: 180,
      renderCell: params => (
        <Link 
          to={`/routes/${params.row.id}`} 
          style={{ 
            textDecoration: "none", 
            fontWeight: 500,
            color: "#1976d2"
          }}
        >
          {params.value}
        </Link>
      )
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: params => params.value || "—"
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 100,
      renderCell: params => (
        <Chip
          label={params.value || "—"}
          size="small"
          color={gradeColor(params.value)}
          variant="outlined"
        />
      )
    },
    {
      field: "prio",
      headerName: "Prio",
      width: 80,
      renderCell: params => (
        <Chip
          label={params.value ?? "—"}
          size="small"
          color={prioColor(params.value)}
          variant="filled"
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      field: "nearest",
      headerName: "Nearest Ref",
      flex: 1,
      minWidth: 140
    },
    {
      field: "length",
      headerName: "Length (m)",
      width: 100,
      renderCell: params => {
        const v = params.row.length;
        return v != null && v !== "" ? `${v}` : "—";
      }
    },
    {
      field: "done",
      headerName: "Done",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: params => params.value ? "✓" : "—"
    }
  ];

  if (err) return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography color="error" variant="h6">Error: {err}</Typography>
      <Link to="/">Back to routes</Link>
    </Box>
  );

  if (loading) return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h6">Loading…</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600} mb={1}>
            {area.name}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack direction="row" spacing={2} mb={2}>
            <Typography variant="body1">
              <strong>Country:</strong> {area.country || "—"}
            </Typography>
            <Typography variant="body1">
              <strong>Routes:</strong> {routes.length}
            </Typography>
          </Stack>

          <Box mt={2}>
            <Link to="/">← Back to all routes</Link>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Routes in {area.name}
          </Typography>
          
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={routes}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              density="comfortable"
              pageSizeOptions={[10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: "name", sort: "asc" }] }
              }}
              sx={{
                "--DataGrid-rowHoverBackground": "rgba(0,0,0,0.04)",
                "& .MuiDataGrid-cell:focus,& .MuiDataGrid-cell:focus-within": { outline: "none" }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}