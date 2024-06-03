import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import NewOrder from '../NewOrder/NewOrder';
import TrackOrders from '../TrackOrders/TrackOrders';
import InventoryTable from '../Inventory/InventoryTable';
import HistoryLog from '../HistoryLog/HistoryLog';
import AddPartForm from '../AddPartForm/AddPartForm';
import Camera from '../Camera/Camera';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Track Orders');
  const [showNewOrderShortcut, setShowNewOrderShortcut] = useState(true);
  const [showAddPartShortcut, setShowAddPartShortcut] = useState(true);
  const [showCameraShortcut, setShowCameraShortcut] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleShortcutClick = (menu) => {
    setSelectedMenu(menu);
    if (menu === 'New Order') {
      setShowNewOrderShortcut(false);
    } else if (menu === 'Track Orders') {
      setShowNewOrderShortcut(true);
    } else if (menu === 'Add Part') {
      setShowAddPartShortcut(false);
    } else if (menu === 'Inventory') {
      setShowAddPartShortcut(true);
    } else if (menu === 'Camera') {
      setShowCameraShortcut(false);
    } else if (menu === 'Inventory') {
      setShowCameraShortcut(true);
    }
  };

  const menu = [
    { text: 'Track Orders', icon: <AssignmentIcon /> },
    { text: 'Inventory', icon: <InventoryIcon /> },
    { text: 'New Order', icon: <AddShoppingCartIcon /> },
    { text: 'Add Part', icon: <AddBoxIcon /> },
    { text: 'Camera', icon: <CameraAltIcon /> },
    { text: 'History & Log', icon: <HistoryIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Inventory Management System
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
        <Toolbar>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              {showNewOrderShortcut ? (
                <Button variant="contained" color="primary" startIcon={<AddShoppingCartIcon />} onClick={() => handleShortcutClick('New Order')}>
                  New Order
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<AssignmentIcon />} onClick={() => handleShortcutClick('Track Orders')}>
                  Track Orders
                </Button>
              )}
            </Grid>
            <Grid item>
              {showAddPartShortcut ? (
                <Button variant="contained" color="primary" startIcon={<AddBoxIcon />} onClick={() => handleShortcutClick('Add Part')}>
                  Add Part
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<InventoryIcon />} onClick={() => handleShortcutClick('Inventory')}>
                  Inventory
                </Button>
              )}
            </Grid>
            <Grid item>
              {showCameraShortcut ? (
                <Button variant="contained" color="primary" startIcon={<CameraAltIcon />} onClick={() => handleShortcutClick('Camera')}>
                  Camera
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<InventoryIcon />} onClick={() => handleShortcutClick('Inventory')}>
                  Inventory
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menu.map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => setSelectedMenu(text)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {selectedMenu === 'New Order' && <NewOrder />}
        {selectedMenu === 'Track Orders' && <TrackOrders />}
        {selectedMenu === 'Inventory' && <InventoryTable />}
        {selectedMenu === 'History & Log' && <HistoryLog />}
        {selectedMenu === 'Add Part' && <AddPartForm />}
        {selectedMenu === 'Camera' && <Camera />}
      </Main>
    </Box>
  );
}
