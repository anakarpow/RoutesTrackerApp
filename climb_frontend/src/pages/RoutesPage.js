// ...existing code...
import BoltIcon from "@mui/icons-material/Bolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import ForestIcon from "@mui/icons-material/Forest";
import LaunchIcon from "@mui/icons-material/Launch";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TerrainIcon from "@mui/icons-material/Terrain";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridToolbarDensitySelector, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRoutes } from "../api";
// ...existing code...

function gradeColor(grade) {
  if (!grade) return "default";
  if (/^[1-3]/.test(grade)) return "success"; // easy
  if (/^4|^5/.test(grade)) return "info";     // moderate
  if (/^6/.test(grade)) return "warning";     // hard
  return "error";                             // very hard (7+)
}

function prioColor(p) {
if (p === null) return "default";
if (p === 1) return "success";
if (p === 2) return "info";
if (p === 3) return "warning";
return "error";}

const typeIconMap = {
  'Sport': <BoltIcon fontSize="small" />, 
  'Trad': <FilterVintageIcon fontSize="small" />, 
  'Alpine ': <TerrainIcon fontSize="small" />, 
  'Alpine': <TerrainIcon fontSize="small" />, 
  'SemiAlpine': <ForestIcon fontSize="small" />,
  'Normal route': <ForestIcon fontSize="small" />,

};



function Toolbar() {
  return (
    <Stack direction="row" spacing={2} sx={{ p: 1, pb: 0, alignItems: "center" }}>
      <GridToolbarQuickFilter placeholder="Search routes…" />
      <GridToolbarDensitySelector />
    </Stack>
  );
}

export default function RoutesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes()
      .then(data =>
        setRows(
          data.map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            grade: r.grade,
            prio: r.prio ?? r.priority ?? null,
            nearest: r.nearest_reference ? r.nearest_reference.name : "—",
            area: r.nearest_reference && r.nearest_reference.area && r.nearest_reference.area.name ? r.nearest_reference.area.name : "—",
            moreInfosAt: r.more_infos_at || r.url || null,
            length: r.length ?? r.route_length ?? null,
            comments: r.comments || r.note || "",
            done: r.done === true || r.completed === true
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo(
    () => [
      // 1 name
      {
        field: "name",
        headerName: "Name",
        flex: 1.1,
        minWidth: 160,
        renderCell: params => (
          <Link 
            to={`/routes/${params.row.id}`} 
            style={{ 
              textDecoration: "none", 
              fontWeight: 500,
              color: "#1976d2"
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.target.style.textDecoration = "none"}
          >
            {params.value}
          </Link>
        )
      },
      // 2 type
      {
        field: "type",
        headerName: "Type",
        width: 120,
        renderCell: params => {
          let icon = null;
          if (params.value && params.value !== '') {
            icon = typeIconMap[params.value] || <RadioButtonUncheckedIcon fontSize="small" sx={{ opacity: 0.4 }} />;
          }
          return (
            <Tooltip title={params.value || "Type"}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {icon}
                <span style={{ fontSize: "0.75rem" }}>{params.value || "—"}</span>
              </Box>
            </Tooltip>
          );
        },
        sortable: false
      },
      // 3 grade
      {
        field: "grade",
        headerName: "Grade",
        width: 110,
        renderCell: params => (
          <Chip
            label={params.value || "—"}
            size="small"
            color={gradeColor(params.value)}
            variant="outlined"
          />
        )
      },
      // 4 prio
      {
        field: "prio",
        headerName: "Prio",
        width: 90,
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
      // 5 nearest reference
      { field: "nearest", headerName: "Nearest Ref", flex: 1, minWidth: 150 },
      // 6 area
      { field: "area", headerName: "Area", flex: 1, minWidth: 140 },
      // 7 more infos at
      {
        field: "moreInfosAt",
        headerName: "More Infos",
        width: 110,
        renderCell: params =>
          params.value ? (
            <Tooltip title={params.value}>
              <IconButton
                size="small"
                component="a"
                href={params.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LaunchIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : (
            "—"
          ),
        sortable: false,
        filterable: false
      },
      // 8 length
      {
        field: "length",
        headerName: "Length (m)",
        width: 110,
        renderCell: params => {
          const v = params.row.length;
          return v != null && v !== "" ? `${v}` : "—";
        },
        sortable: true
      },
      // 9 comments
      {
        field: "comments",
        headerName: "Comments",
        flex: 1.2,
        minWidth: 180,
        renderCell: params => {
          let val = params.value;
          if (val == null) val = "";
          if (typeof val !== "string") val = String(val);
          const short = val.length > 40 ? val.slice(0, 40) + "…" : val || "—";
          return (
            <Tooltip title={val || "No comments"}>
              <span style={{ fontSize: "0.75rem", lineHeight: 1.2 }}>{short}</span>
            </Tooltip>
          );
        },
        sortable: false
      },
      // 10 done
      {
        field: "done",
        headerName: "Done",
        width: 80,
        align: "center",
        headerAlign: "center",
        renderCell: params =>
          params.value ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <RadioButtonUncheckedIcon sx={{ opacity: 0.4 }} fontSize="small" />
          )
      }
    ],
    []
  );

  return (
    <Box sx={{ height: 640, width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "baseline", mb: 1, gap: 2 }}>
        <h2 style={{ margin: 0 }}>Routes</h2>
        <small style={{ opacity: 0.7 }}>{rows.length} total</small>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        density="comfortable"
        pageSizeOptions={[10, 25, 50]}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 400 } }
        }}
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
  );
}
// ...existing code...