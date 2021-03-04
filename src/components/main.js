import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button, Input, Paper, TextField } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Address from './address';
import XGridDemo from './transactions';
import Summary from './summary';
import Bird from './../bird_logo.png';
import Grid from '@material-ui/core/Grid';
import ProviderCard from './shared/ProviderCard';

import Web3 from 'web3';
import { addresses, abis } from '../contracts';
const useStyles = makeStyles((theme) => ({
  typography: {
    fontFamily: [
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  root: {
    background: 'none',
    backgroundColor: 'transparent',
  },
  body: {
    background: 'none',
    backgroundColor: 'transparent',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: theme.palette.secondary.main,
  },
  avatar: {
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  marginTop: {
    marginTop: theme.spacing(8),
  },
  nodes: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(6),
    textAlign: 'center',
  },
  noPadding: {
    padding: theme.spacing(0),
  },
}));

function Copyright() {
  return (
    <div>
      <Typography variant='body1' color='textPrimary' align='center'>
        How to Use <br />
        Add an account with transaction history on the ethereum mainnet to see
        valid result. Any issues, please contact admin@bird.money
      </Typography>
      <Typography variant='body2' color='textSecondary' align='center'>
        {'Copyright © '}
        <Link color='inherit' target='_blank' href='https://bird.money'>
          Bird.Money
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        <br />
        Follow us on &nbsp;
        <Link
          color='error'
          target='_blank'
          href='https://twitter.com/_birdmoney'
        >
          Twitter
        </Link>{' '}
        |
        <Link color='error' target='_blank' href='https://discord.gg/Z2BeCnS'>
          &nbsp;Discord
        </Link>{' '}
        |
        <Link
          color='error'
          target='_blank'
          href='https://medium.com/bird-money'
        >
          &nbsp;Medium
        </Link>
      </Typography>
      <div></div>
    </div>
  );
}

const Main = (props) => {
  const classes = useStyles();
  const account = props.account;
  const web3Obj = props.web3Obj;

  const [valueOfUserInput, setUserChange] = useState('');
  const [Ethersdata, setEtherdata] = useState('');
  const [birdData, setBirddata] = useState('');
  const [EthBalance, setEthBalance] = useState('');
  const [providers, setProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [error, setError] = useState(null);

  const getContract = () => {
    const web3 = web3Obj;
    const abi = abis.bird;
    const address = addresses.kovan;
    const contract = new web3.eth.Contract(abi, address);
    return contract;
  };
  const loadProviders = () => {
    getContract()
      .methods.getProviders()
      .call()
      .then((a) => {
        setProviders(a);
        console.log('providers:', a);
      })
      .catch(console.log);
  };

  const getProvidersView = (gotProviders) => {
    let providersArr = [];
    for (let i = 0; i < gotProviders.length; i++) {
      providersArr.push(
        <ProviderCard
          i={i}
          key={gotProviders[i]}
          address={gotProviders[i]}
          pos={classes.pos}
          paper={classes.paper}
          nodes={classes.nodes}
        ></ProviderCard>
      );
    }
    return providersArr;

    // return gotProviders.map((p) => (
    //   <ProviderCard
    //     i={p}
    //     key={p}
    //     address={p}
    //     pos={classes.pos}
    //     paper={classes.paper}
    //     nodes={classes.nodes}
    //   ></ProviderCard>
    // ));
  };
  const contract = getContract();
  const addProvider = (addr) => {
    contract.methods
      .addProvider(addr)
      .send({ from: account })
      .then((a) => {
        //setProviders(providers.concat(a));
        window.location.reload();

        console.log('then of addProvider: ', a);
      })
      .catch((a) => console.log('catch of addProvider: ', a));

    contract.events.ProviderAdded((err, res) => {
      if (err === null) {
        const addedProvider = res.returnValues.provider;
        console.log('provider added: ', addedProvider);
        console.log('providers updated: ', providers.concat(addedProvider));
        //(providers.concat(addedProvider));
      } else {
        console.error('error of provider added: ', err);
      }
    });
  };

  const removeProvider = (addr) => {
    contract.methods
      .removeProvider(addr)
      .send({ from: account })
      .then((a) => {
        console.log('then of removeProvider: ', a);
        //setProviders(providers.filter((a) => a !== addr));
        window.location.reload();
      })
      .catch((a) => console.log('catch of removeProvider: ', a));

    contract.events.ProviderRemoved((err, res) => {
      if (err === null) {
        let removedProvider = res.returnValues.provider;
        console.log('ProviderRemoved res obj: ', res);
        console.log('provider removed: ', removedProvider);
        // console.log(
        //   providers.filter((id) => {
        //     console.log(id);
        //     return id !== removedProvider.address;
        //   })
        // );
        console.log(
          'providers after delete: ',

          providers.filter((id) => id !== removedProvider),
          '\n',
          providers.map((id) => (id === removeProvider ? '0' : id))
        );
        //yarn (providers.map((id) => (id == removeProvider ? 0 : id)));
      } else {
        console.error('error of provider removed: ', err);
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // loadEtherscan(valueOfUserInput);
    EtherBalance(valueOfUserInput);
  };

  useEffect(() => {
    const trigger = async () => {
      if (account) {
        await loadDefault();
      }
    };
    trigger();
  }, []);

  const loadDefault = async () => {
    // loadEtherscan(account);
    EtherBalance(account);
  };

  const handleUserInputChange = (e) => {
    setUserChange(e.target.value);
  };

  function EtherBalance(address) {
    loadProviders();

    // const birdApi = `https://www.bird.money/analytics/address/${address}`;
    const birdApi = `https://api.birdprotocol.com/analytics/address/${address}`;
    fetch(birdApi)
      .then((res) => res.json())
      .then(
        (result) => {
          setBirddata(result);
          const balance = result.eth_balance.toFixed(4);
          setEthBalance(balance);
        },
        (error) => {
          console.log(error);
          setError(error);
        }
      );
  }

  return (
    <Container className={classes.root}>
      {
        birdData ? (
          <Summary
            bird={birdData}
            account={account}
            web3Obj={web3Obj}
          ></Summary>
        ) : (
          <div>{error}</div>
          // <div>No Transaction History</div>
        ) // or whatever loading state you want, could be null
      }

      <Container className={classes.noPadding}>
        <Grid className={classes.marginTop}>
          <Grid item xs={12}>
            <Typography component='h1' variant='h4'>
              Oracle Nodes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component='h1' variant='h4'>
              <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                  label='ETH Address'
                  variant='outlined'
                  value={selectedProvider}
                  type='text'
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                  }}
                ></TextField>
                {/* <button visible={false}>.</button> */}
                <Button
                  color='primary'
                  variant='contained'
                  disableElevation
                  onClick={() => addProvider(selectedProvider)}
                >
                  ADD
                </Button>
                <Button
                  variant='contained'
                  disableElevation
                  onClick={() => removeProvider(selectedProvider)}
                >
                  REMOVE
                </Button>
              </form>
            </Typography>
          </Grid>

          <Grid container spacing={3}>
            {providers ? (
              getProvidersView(providers)
            ) : (
              // providers
              <Typography component='h2' variant='h4'>
                Loading ...
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Main;
