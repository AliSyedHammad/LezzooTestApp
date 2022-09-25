import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
    Box,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';
import { CodeOutlined, CopyOutlined, FormOutlined, PlusCircleOutlined, MenuUnfoldOutlined, EyeFilled } from '@ant-design/icons';

// project import
import Dot from 'components/@extended/Dot';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'idStores',
        align: 'left',
        disablePadding: false,
        label: 'Store ID'
    },
    {
        id: 'Name',
        align: 'left',
        disablePadding: true,
        label: 'Store Name'
    },
    {
        id: 'LogoPath',
        align: 'center',
        disablePadding: false,
        label: 'Logo'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Actions'
    }
    // {
    //     id: 'protein',
    //     align: 'right',
    //     disablePadding: false,
    //     label: 'Total Amount'
    // }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 0:
            color = 'warning';
            title = 'Pending';
            break;
        case 1:
            color = 'success';
            title = 'Approved';
            break;
        case 2:
            color = 'error';
            title = 'Rejected';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function StoreTable({ dirtyCache, setDirtyCache, showProductDialog, showCategoryDialog, showStoreInfoDialog }) {
    const [order] = useState('asc');
    const [orderBy] = useState('idStores');
    const [selected] = useState([]);

    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!dirtyCache) return;
        // fetch rows at page load from https://c47fa88f-c97d-467c-86c6-5b1187da860f.mock.pstmn.io/fetchStores
        fetch('http://localhost:3002/fetchStores')
            .then((response) => response.json())
            .then((data) => {
                setRows(data);
            })
            .then(() => setDirtyCache(false));
    }, [dirtyCache]);

    const isSelected = (idStores) => selected.indexOf(idStores) !== -1;

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-child': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-child': {
                            pr: 3
                        }
                    }}
                >
                    <OrderTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {
                            // for every row in rows, create a table row
                            rows.map((row, index) => {
                                const isItemSelected = isSelected(row.idStores);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.idStores}
                                        selected={isItemSelected}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="left">
                                            {row.idStores}
                                        </TableCell>
                                        <TableCell align="left">{row.Name}</TableCell>
                                        <TableCell align="center">
                                            {<img src={row.Logo} alt="Logo" width="50" height="50" style={{ borderRadius: 5 }} />}
                                        </TableCell>

                                        {/* 3 icon action buttons: addCategory, addProducttoCategory, ShowAllProducts */}
                                        <TableCell align="center">
                                            <Tooltip title="Add Category" placement="top">
                                                <IconButton onClick={() => showCategoryDialog(row.idStores)}>
                                                    <MenuUnfoldOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Add Product" placement="top">
                                                <IconButton onClick={() => showProductDialog(row.idStores)}>
                                                    <PlusCircleOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Show Products" placement="top">
                                                <IconButton onClick={() => showStoreInfoDialog(row.idStores, row.Name)}>
                                                    <EyeFilled />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
