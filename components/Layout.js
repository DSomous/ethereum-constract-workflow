import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    display: 'flex',
    flexDriction: 'column',
    with: '100%',
    minHeight: '100vh'
  },
  wrapper: {
    with: '80%',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '1em'
  }
}

class Layout extends React.Component {
  render () {
    console.log(this);
    
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.wrapper}>{this.props.children}</div>
      </div>
    )
  }
}

export default withStyles(styles)(Layout);