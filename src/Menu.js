import React, { Component } from "react";
import { View, FlatList } from "react-native";
import {
  Menu as PaperMenu,
  Divider,
  Text,
  TouchableRipple
} from "react-native-paper";

type Props = {
  title: string,
  onItemPress: () => void,
  items: any
};

class Menu extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  renderSubtitle = ({ item }) => {
    const { title } = item;
    const { onItemPress } = this.props;
    const name = this.cleanName(title);
    return (
      <View>
        <PaperMenu.Item
          onPress={() => {
            onItemPress(item);
            this._closeMenu();
          }}
          title={name}
        />
      </View>
    );
  };

  cleanName = name => {
    if (!name) {
      return "";
    }
    const name_splitted = name.split(/:(.+)/, 2);
    const out = name_splitted[name_splitted.length - 1];
    return out;
  };

  render() {
    const { title, items } = this.props;
    const { visible } = this.state;

    return (
      <PaperMenu
        visible={visible}
        onDismiss={this._closeMenu}
        anchor={
          <TouchableRipple onPress={this._openMenu}>
            <Text style={{ padding: 5 }}>{title}</Text>
          </TouchableRipple>
        }
      >
        <FlatList
          data={items}
          renderItem={this.renderSubtitle}
          ItemSeparatorComponent={() => <Divider />}
          keyExtractor={(i, index) => `${i.title}-${index}`}
        />
      </PaperMenu>
    );
  }
}

export default Menu;
