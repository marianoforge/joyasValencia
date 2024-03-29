import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, Box, Typography, useMediaQuery } from '@mui/material';
import Item from '../../components/Item';
import { setItems } from '../../state';

const ShopingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('all');
  const items = useSelector((state) => state.cart.items);
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  async function getItems() {
    const items = await fetch(
      'https://strapi-app-2qbph.ondigitalocean.app/api/items?populate=image',
      {
        method: 'GET',
        cors: 'no-cors',
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );

    const itemsJson = await items.json();
    console.log(itemsJson);
    dispatch(setItems(itemsJson.data));
  }

  useEffect(() => {
    getItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topRatedItems = items.filter(
    (item) => item.attributes.category === 'topRated'
  );
  const newArrivalsItems = items.filter(
    (item) => item.attributes.category === 'newArrivals'
  );
  const bestSellersItems = items.filter(
    (item) => item.attributes.category === 'bestSellers'
  );

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: isNonMobile ? 'block' : 'none' } }}
        sx={{
          m: '25px',
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="NEW ARRIVALS" value="newArrivals" />
        <Tab label="BEST SELLERS" value="bestSellers" />
        <Tab label="TOP RATED" value="topRated" />
      </Tabs>
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === 'all' &&
          items.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`}></Item>
          ))}
        {value === 'newArrivals' &&
          newArrivalsItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`}></Item>
          ))}
        {value === 'bestSellers' &&
          bestSellersItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`}></Item>
          ))}
        {value === 'topRated' &&
          topRatedItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`}></Item>
          ))}
      </Box>
    </Box>
  );
};

export default ShopingList;
