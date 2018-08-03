import React from 'react';
import { Button } from '@material-ui/core';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';

class index extends React.Component {
  render() {
    return (
      <Layout>
        <Button color="primary" variant="raised">
          Welcome to Ethereum ICO DApp!
        </Button>
      </Layout>
    )
  }
}

export default withRoot(index);