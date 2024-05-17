import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import QRCode from 'qrcode.react';

const downloadQRCode = (partName, id) => {
  const canvas = document.getElementById(`qr-${id}`);
  const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  let downloadLink = document.createElement('a');
  downloadLink.href = pngUrl;
  downloadLink.download = `${partName}-${id}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

function createData(id, partName, date, moi, perPartPrice, invoiceFile, imageFile) {
  return { id, partName, date, moi, perPartPrice, invoiceFile, imageFile };
}



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'partName', numeric: false, disablePadding: true, label: 'Part Name' },
  { id: 'moi', numeric: false, disablePadding: false, label: 'MoI' },
  { id: 'perPartPrice', numeric: true, disablePadding: false, label: 'Per Part Price' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all parts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleAddClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
          display="flex"
          alignItems="center"
        >
          Parts Inventory
          <Tooltip title="Add">
            <IconButton onClick={handleAddClick}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleAddClick: PropTypes.func.isRequired,
};

export default function InventoryTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('partName');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([
    createData(1, 'Part A', '2023-05-01', 'MoI A', 10.0, null, null),
    createData(2, 'Part B', '2023-05-02', 'MoI B', 20.0, null, null),
    createData(3, 'Part C', '2023-05-03', 'MoI C', 30.0, null, null),
    createData(4, 'Part D', '2023-05-04', 'MoI D', 40.0, null, null),
    createData(5, 'Part E', '2023-05-05', 'MoI E', 50.0, null, null),
  ]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState([{
    partName: '',
    moi: '',
    perPartPrice: '',
    imageFile: null,
  }]);
  const [date, setDate] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.partName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    setDetailRow(row);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailRow(null);
    setEditMode(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues([{
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
    }]);
    setDate('');
    setInvoiceFile(null);
  };

  const handleInputChange = (index, event) => {
    const newFormValues = [...formValues];
    const { name, value, files } = event.target;
    newFormValues[index][name] = files ? files[0] : value;
    setFormValues(newFormValues);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleInvoiceFileChange = (event) => {
    setInvoiceFile(event.target.files[0]);
  };

  const handleAddRow = () => {
    setFormValues([...formValues, {
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
    }]);
  };

  const handleRemoveRow = (index) => {
    const newFormValues = [...formValues];
    newFormValues.splice(index, 1);
    setFormValues(newFormValues);
  };

  const handleSave = () => {
    const newRows = formValues.map((formValue) => createData(Date.now(), formValue.partName, date, formValue.moi, formValue.perPartPrice, invoiceFile, formValue.imageFile));
    setRows([...rows, ...newRows]);
    setFormValues([{
      partName: '',
      moi: '',
      perPartPrice: '',
      imageFile: null,
    }]);
    setDate('');
    setInvoiceFile(null);
    setOpen(false);
  };

  const handleEditSave = () => {
    const updatedRows = rows.map((row) => {
      if (row.id === detailRow.id) {
        return { ...row, ...detailRow };
      }
      return row;
    });
    setRows(updatedRows);
    handleDetailClose();
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleEditInputChange = (event) => {
    const { name, value, files } = event.target;
    setDetailRow((prevDetailRow) => ({
      ...prevDetailRow,
      [name]: files ? files[0] : value,
    }));
  };

  const generateQRCode = (partName, id) => {
    const qrCodeValue = `${partName} (ID: ${id})`;
    return (
      <QRCode value={qrCodeValue} size={128} />
    );
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} handleAddClick={handleAddClick} />
        <Box sx={{ overflowX: 'auto', padding: '8px' }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750, maxWidth: '100%' }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
            <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
            <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.partName);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                       </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.partName}
                        </TableCell>
                        <TableCell>{row.moi}</TableCell>
                        <TableCell align="right">{row.perPartPrice}</TableCell>
                      </TableRow>
                    );
                  })}
             {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', padding: '8px' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ flex: '1 1 auto', padding: '8px' }}
          />
        </Box>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Part</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            name="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={handleDateChange}
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<AttachFileIcon />}
            sx={{ mt: 2, mb: 1 }}
          >
            Upload Invoice
            <input
              type="file"
              hidden
              name="invoiceFile"
              onChange={handleInvoiceFileChange}
            />
          </Button>
          {formValues.map((formValue, index) => (
            <Box key={index} mb={2}>
              <TextField
                margin="dense"
                label="Part Name"
                type="text"
                fullWidth
                variant="outlined"
                name="partName"
                value={formValue.partName}
                onChange={(event) => handleInputChange(index, event)}
              />
              <TextField
                margin="dense"
                label="MoI"
                type="text"
                fullWidth
                variant="outlined"
                name="moi"
                value={formValue.moi}
                onChange={(event) => handleInputChange(index, event)}
              />
              <TextField
                margin="dense"
                label="Per Part Price"
                type="number"
                fullWidth
                variant="outlined"
                name="perPartPrice"
                value={formValue.perPartPrice}
                onChange={(event) => handleInputChange(index, event)}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<ImageIcon />}
                sx={{ mt: 2, mb: 1, ml: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  name="imageFile"
                  onChange={(event) => handleInputChange(index, event)}
                />
              </Button>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveRow(index)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRow}
          >
            Add Another Part
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailOpen} onClose={handleDetailClose} maxWidth="sm" fullWidth>
  <DialogTitle>Part Details</DialogTitle>
  <DialogContent>
    {detailRow && (
      <Box>
        <Typography variant="h6">{detailRow.partName}</Typography>
        <Typography variant="body1">Date: {detailRow.date}</Typography>
        <Typography variant="body1">MoI: {detailRow.moi}</Typography>
        <Typography variant="body1">Per Part Price: ${detailRow.perPartPrice}</Typography>
        <Box mt={2}>
          <Typography variant="body2">Invoice File:</Typography>
          {detailRow.invoiceFile ? (
            <Button variant="contained" component="a" href={URL.createObjectURL(detailRow.invoiceFile)} download>
              Download Invoice
            </Button>
          ) : (
            <Typography variant="body2">No Invoice File Uploaded</Typography>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="body2">Image File:</Typography>
          {detailRow.imageFile ? (
            <Box component="img" src={URL.createObjectURL(detailRow.imageFile)} alt="Part Image" sx={{ width: '100%', maxHeight: 300 }} />
          ) : (
            <Typography variant="body2">No Image File Uploaded</Typography>
          )}
        </Box>
        <Box mt={2} id={`qr-${detailRow.id}`}>
          <QRCode value={`${detailRow.partName} (ID: ${detailRow.id})`} size={128} />
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => downloadQRCode(detailRow.partName, detailRow.id)}>
            Download QR Code
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </Box>
      </Box>
    )}
    {editMode && detailRow && (
      <Box mt={2}>
        <TextField
          margin="dense"
          label="Part Name"
          type="text"
          fullWidth
          variant="outlined"
          name="partName"
          value={detailRow.partName}
          onChange={handleEditInputChange}
        />
        <TextField
          margin="dense"
          label="MoI"
          type="text"
          fullWidth
          variant="outlined"
          name="moi"
          value={detailRow.moi}
          onChange={handleEditInputChange}
        />
        <TextField
          margin="dense"
          label="Per Part Price"
          type="number"
          fullWidth
          variant="outlined"
          name="perPartPrice"
          value={detailRow.perPartPrice}
          onChange={handleEditInputChange}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<AttachFileIcon />}
          >
            Upload Invoice
            <input
              type="file"
              hidden
              name="invoiceFile"
              onChange={handleEditInputChange}
            />
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<ImageIcon />}
          >
            Upload Image
            <input
              type="file"
              hidden
              name="imageFile"
              onChange={handleEditInputChange}
            />
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleEditSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDetailClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    )}
  </DialogContent>
</Dialog>

    </Box>
  );
}
