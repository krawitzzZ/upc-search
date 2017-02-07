import React, { PropTypes, Component } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  View,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';
import XMLParser from 'react-xml-parser';
import Item from '@components/item/Item';
import styles from './styles';


export default class AppView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      inputValue: '074757376X',
      upc: 'UPC',
      isbn: 'ISBN',
      upcReg: /^[0-9]{12}$/,
      isbnReg: /^\d{9}[\dXx]$/,
    };
  }

  static propTypes = {
    info: PropTypes.object,
    fetchProductInfo: PropTypes.func,
    clearInfo: PropTypes.func,
  };

  onInputChange = (value) => {
    if (value.length > 12) {
      return;
    }

    this.setState({ inputValue: value.trim() });
  };

  validateIdType = () => {
    const upcMatch = this.state.upcReg.test(this.state.inputValue);
    const isbnMatch = this.state.isbnReg.test(this.state.inputValue);

    if (upcMatch) {
      return this.state.upc;
    }

    if (isbnMatch) {
      return this.state.isbn;
    }

    this.showModal();
    return false;
  };

  showModal = () => {
    this.setState({ modalVisible: true }, () => {
      setTimeout(this.closeModal, 2500);
    });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  search = () => {
    const idType = this.validateIdType();

    if (idType) {
      this.props.fetchProductInfo(this.state.inputValue, idType);
    }
  };

  clear = () => {
    this.props.clearInfo();
    this.setState({ inputValue: '' });
  };

  parseXMLResponse = (xml) => {
    if (!xml) {
      return [];
    }

    const parsedXML = new XMLParser().parseFromString(xml);
    const errors = parsedXML.getElementsByTagName('Error');

    if (errors.length) {
      let error = {};
      error['Error'] = errors[0].getElementsByTagName('Message')[0].value;
      return [error];
    }

    let items = [];
    parsedXML.getElementsByTagName('Item').forEach(item => {
      let formattedItem = {};

      item.children.forEach(child => {
        if (child.name == 'ItemLinks') {
          return;
        }

        if (child.name == 'ItemAttributes') {
          formattedItem[child.name] = [];
          child.children.forEach(deepChild => {
            formattedItem[child.name].push({
              [deepChild.name]: deepChild.value,
            });
          });
        }

        if (child.children.length === 0) {
          formattedItem[child.name] = child.value;
        }
      });

      items.push(formattedItem);
    });

    return items;
  };

  getItems = () => {
    return this.parseXMLResponse(this.props.info.info);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Amazon Search!
        </Text>
        <Text style={styles.hint}>
          Type UPC or ISBN number and press `Search`
        </Text>
        <View style={[styles.button, styles.input]}>
          <TextInput
            style={styles.input}
            onChangeText={this.onInputChange}
            value={this.state.inputValue}
          />
        </View>
        <View style={styles.button}>
          <TouchableOpacity>
            <Button title="Search" onPress={this.search}/>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity>
            <Button title="Clear Results" onPress={this.clear}/>
          </TouchableOpacity>
        </View>
        {this.props.info.loadingProduct ?
          <View style={styles.activity}>
            <ActivityIndicator size="large"/>
          </View> :
          <View>
            {this.getItems().map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </View>
        }
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          <Text style={styles.modalText}>Type valid UPC or ISBN code</Text>
        </Modal>
      </ScrollView>
    );
  }
}
