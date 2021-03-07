import { Grid, Link, Paper, Typography } from '@material-ui/core';
import React from 'react';

const providerCard = (props) => {
  return (
    <Grid item xs={4} sm={6} md={6} lg={6}>
      <Paper className={(props.paper, props.nodes)}>
        <Typography variant='h4'>Node {props.i + 1}</Typography>
        <Typography className={props.pos} color='textSecondary'>
          Status: <span>Active</span>
        </Typography>
        <Typography variant='caption' display='block' gutterBottom>
          Address
          <br />
          <Link
            target='_blank'
            href='https://kovan.etherscan.io/address/0x58Fd79D34Edc6362f92c6799eE46945113A6EA91'
          >
            {props.address}
          </Link>{' '}
        </Typography>
      </Paper>
    </Grid>
  );
};

export default providerCard;
