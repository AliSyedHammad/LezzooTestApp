// material-ui
import {
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Box,
    TextField,
    InputLabel,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// project import
import MainCard from 'components/MainCard';
import { useState } from 'react';
import StoreTable from './StoreTable';
// ==============================|| SAMPLE PAGE ||============================== //

async function imgToBase64(img_id) {
    try {
        const storeImage = document.getElementById(img_id).files[0];
        const imgURL = await fetch(URL.createObjectURL(storeImage));
        const blob = await imgURL.blob();
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.log(error);
        reject('');
    }
}

const StorePage = () => {
    const [openAddStore, setOpenAddStore] = useState(false);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [openAddCategory, setOpenAddCategory] = useState(false);
    const [openStoreInfo, setOpenStoreInfo] = useState(false);

    const [storeInfo, setStoreInfo] = useState([]);
    const [dirtyCache, setDirtyCache] = useState(true);
    const [storeId, setStoreId] = useState(null);
    const [storeName, setStoreName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [options, setOptions] = useState([]);

    const handleCategoryDropdown = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleCloseAddStore = async (event, reason) => {
        if (reason && reason == 'backdropClick') return;

        setOpenAddStore(false);

        const storeName = document.getElementById('store_name').value;

        // get image from input and convert to base64
        const base64 = await imgToBase64('store_logo');

        const response = await fetch('http://localhost:3002/insertStore', {
            method: 'POST',
            body: JSON.stringify({
                Name: storeName,
                Logo: base64
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setDirtyCache(true);
    };

    const handleCloseAddProduct = async (event, reason) => {
        if (reason && reason == 'backdropClick') return;

        setOpenAddProduct(false);
        const productName = document.getElementById('product_name').value;
        const productPrice = document.getElementById('product_price').value;
        const productCategory = selectedCategory;
        const productImage = await imgToBase64('product_image');

        console.log(productName, productPrice, productCategory, storeId);

        try {
            const response = await fetch('http://localhost:3002/insertProduct', {
                method: 'POST',
                body: JSON.stringify({
                    Name: productName,
                    Price: productPrice,
                    Category: productCategory,
                    Image: productImage,
                    idStores: storeId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setDirtyCache(true);
        } catch (error) {
            console.log(error);
        }
    };

    // TODO store_info = [ {categ_name: xyz, categ_img: xyz, categ_products: [{prod_name: xyz, prod_img: xyz, prod_price: xyz, prod_id: xyz}]} ]

    const handleCloseAddCategory = async (event, reason) => {
        if (reason && reason == 'backdropClick') return;

        setOpenAddCategory(false);
        const categoryName = document.getElementById('category_name').value;
        const categoryImg = await imgToBase64('category_image');
        const category_response = await fetch('http://localhost:3002/insertCategory', {
            method: 'POST',
            body: JSON.stringify({
                idStores: storeId,
                Name: categoryName,
                Image: categoryImg
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setDirtyCache(true);
    };

    const handleOpenAddProduct = async (storeid) => {
        const category_data = await fetch(`http://localhost:3002/fetchCategories?idStores=${storeid}`, {
            method: 'GET'
        });
        const category_json = await category_data.json();
        setOptions(category_json);
        setOpenAddProduct(true);
    };

    const handleStoreInfoOpen = async (storeid, storeName) => {
        const store_data = await fetch(`http://localhost:3002/fetchProducts?idStores=${storeid}`, {
            method: 'GET'
        });
        const store_json = await store_data.json();
        console.log(store_json);
        setStoreInfo(store_json);
        setStoreId(storeId);
        setOpenStoreInfo(true);
        setStoreName(storeName);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 20 }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => setOpenAddStore(true)}>
                    Add Store
                </Button>
            </div>
            <MainCard title="Store List">
                <StoreTable
                    showCategoryDialog={(storeId) => {
                        setOpenAddCategory(true);
                        setStoreId(storeId);
                    }}
                    showProductDialog={(storeId) => {
                        handleOpenAddProduct(storeId);
                        setStoreId(storeId);
                    }}
                    showStoreInfoDialog={(storeId, storeName) => {
                        handleStoreInfoOpen(storeId, storeName);
                        //TODO: show store info dialog
                    }}
                    dirtyCache={dirtyCache}
                    setDirtyCache={setDirtyCache}
                />
            </MainCard>

            {/* Add Store Dialog */}
            <Dialog open={openAddStore} onClose={handleCloseAddStore} id="store_form">
                <DialogTitle>Add Store</DialogTitle>
                <DialogContent>
                    <DialogContentText>Add your store information here.</DialogContentText>
                    <TextField margin="dense" id="store_name" label="Store Name" type="text" variant="standard" />
                    {/* Upload Button */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Upload Store Image
                        </Typography>
                        <input accept="image/*" id="store_logo" type="file" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddStore(false)}>Cancel</Button>
                    <Button onClick={handleCloseAddStore}>Add Store</Button>
                </DialogActions>
            </Dialog>

            {/* Add Product Dialog */}
            <Dialog open={openAddProduct} onClose={handleCloseAddProduct}>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ paddingBottom: 15 }}>Add your product information here.</DialogContentText>

                    <FormControl fullWidth>
                        <InputLabel id="inp">Category</InputLabel>
                        <Select
                            labelId="select-label"
                            id="category_dropdown"
                            value={selectedCategory}
                            label="Category"
                            onChange={handleCategoryDropdown}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField margin="dense" id="product_name" label="Product Name" type="text" variant="standard" />
                        <TextField margin="dense" id="product_price" label="Product Price" type="text" variant="standard" />
                    </div>
                    {/* Upload Button */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Upload Product Image
                        </Typography>
                        <input accept="image/*" id="product_image" type="file" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddProduct(false)}>Cancel</Button>
                    <Button onClick={handleCloseAddProduct}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Add Category Dialog */}
            <Dialog open={openAddCategory} onClose={handleCloseAddCategory}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <DialogContentText>Name your category</DialogContentText>
                    <TextField margin="dense" id="category_name" label="Category" type="text" variant="standard" />
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Upload Category Image
                        </Typography>
                        <input accept="image/*" id="category_image" type="file" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddCategory(false)}>Cancel</Button>
                    <Button onClick={handleCloseAddCategory}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Store Info Dialog */}
            <Dialog open={openStoreInfo} onClose={() => setOpenStoreInfo(false)} fullScreen>
                <DialogTitle>{`${storeName} Store Info`}</DialogTitle>
                <DialogContent>
                    {storeInfo.map((category) => (
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    paddingBottom: 10
                                }}
                            >
                                <DialogContentText style={{ fontSize: 36 }}>{category.Name}</DialogContentText>
                                <img src={category.Image} style={{ width: 50, height: 50, borderRadius: 10 }} alt="" />
                            </div>
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
                                    {category.products.length > 0 ? (
                                        <>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" padding="none">
                                                        {'Name'}
                                                    </TableCell>
                                                    <TableCell align="center" padding="none">
                                                        {'Price'}
                                                    </TableCell>
                                                    <TableCell align="center" padding="none">
                                                        {'Image'}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {category.products.map((product) => (
                                                    // table with headings product name, price, image

                                                    <TableRow
                                                        hover
                                                        tabIndex={-1}
                                                        key={product.Name}
                                                        role="checkbox"
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="center" padding="none">
                                                            {product.Name}
                                                        </TableCell>
                                                        <TableCell align="center" padding="none">
                                                            {product.Price}
                                                        </TableCell>
                                                        <TableCell align="center" padding="none">
                                                            <img
                                                                src={product.Image}
                                                                style={{ width: 50, height: 50, borderRadius: 10 }}
                                                                alt=""
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </>
                                    ) : null}
                                </Table>
                            </TableContainer>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStoreInfo(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StorePage;
