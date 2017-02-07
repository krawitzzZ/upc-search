import React, { PropTypes, Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';


export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object,
  };

  getItemInfo = () => {
    const item = this.props.item;
    let info = [];

    Object.keys(item).forEach((key, i) => {
      if (!Array.isArray(item[key])) {
        info.push(
          <Text style={styles.description} key={i}>{`${key}: ${item[key]}`}</Text>
        );
      }

      else {
        item[key].forEach(it => {
          Object.keys(it).forEach((deepKey) => {
            info.push(
              <Text style={styles.description} key={`${i}-deep-${it[deepKey]}`}>
                {`${deepKey}: ${it[deepKey]}`}
              </Text>
            );
          });
        });
      }
    });

    return info;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Item info:</Text>
        {this.getItemInfo()}
      </View>
    );
  }
}

