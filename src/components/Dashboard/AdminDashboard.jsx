import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, IconButton, Button } from "@mui/material";
 
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import { styled } from "@mui/material/styles";
import ClientTable from "../Client/ClientTable"; // Asegúrate de tener este componente creado

const DashboardContainer = styled("div")(({ theme }) => ({
  padding: "40px",
  backgroundColor: "#f4f6f8",
  minHeight: "100vh",
  textAlign: "center",
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "32px",
  fontWeight: "bold",
  color: "#37474f",
  marginBottom: "20px",
}));

const CustomCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
  },
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
}));

const AdminDashboard = () => {
  // Estado para controlar la vista seleccionada:
  // "dashboard" (vista principal) o "clients" (gestión de clientes)
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <DashboardContainer>
      {selectedView === "dashboard" && (
        <>
          <DashboardTitle variant="h4">
            Panel de Administración
          </DashboardTitle>
          <Grid container spacing={3} justifyContent="center">
            {/* Crear Cliente */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomCard onClick={() => setSelectedView("createClient")}>
                <CardContent style={{ textAlign: "center" }}>
                  <IconButton color="primary">
                    <PersonAddIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Crear Cliente
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Agrega nuevos clientes al sistema.
                  </Typography>
                </CardContent>
              </CustomCard>
            </Grid>

            {/* Gestionar Clientes */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomCard onClick={() => setSelectedView("clients")}>
                <CardContent style={{ textAlign: "center" }}>
                  <IconButton color="primary">
                    <GroupIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Gestionar Clientes
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Administra la información de los clientes.
                  </Typography>
                </CardContent>
              </CustomCard>
            </Grid>

            {/* Gestionar Roles */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomCard onClick={() => setSelectedView("roles")}>
                <CardContent style={{ textAlign: "center" }}>
                  <IconButton color="primary">
                    <SecurityIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Gestionar Roles
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Asigna y gestiona roles de usuario.
                  </Typography>
                </CardContent>
              </CustomCard>
            </Grid>
          </Grid>
        </>
      )}

      {selectedView === "clients" && (
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
            <Button variant="outlined" onClick={() => setSelectedView("dashboard")}>
              Volver al Dashboard
            </Button>
          </Box>
          <ClientTable />
        </>
      )}

      {selectedView === "createClient" && (
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
            <Button variant="outlined" onClick={() => setSelectedView("dashboard")}>
              Volver al Dashboard
            </Button>
          </Box>
          {/* Aquí podrías incluir el componente o la vista para crear clientes.
              Por ejemplo, si tienes un componente CreateUser o un modal similar, lo integras aquí. */}
          <Typography variant="h5" sx={{ mt: 2 }}>
            Vista de Crear Cliente
          </Typography>
          {/* ... */}
        </>
      )}

      {selectedView === "roles" && (
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
            <Button variant="outlined" onClick={() => setSelectedView("dashboard")}>
              Volver al Dashboard
            </Button>
          </Box>
          {/* Aquí integras el componente o vista de gestión de roles */}
          <Typography variant="h5" sx={{ mt: 2 }}>
            Vista de Gestión de Roles
          </Typography>
          {/* ... */}
        </>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;
