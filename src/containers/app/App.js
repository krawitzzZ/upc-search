import React, { PropTypes, Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as productActions from '@reducers/product';
import AppView from './AppView';


export default connect(
  state => ({
    info: state.product,
  }),
  {
    fetchProductInfo: productActions.fetchProductInfo,
    clearInfo: productActions.clearInfo,
  }
)(AppView);
