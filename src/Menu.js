import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import MaterialMenu, {
  MenuItem,
  MenuDivider
} from "react-native-material-menu";

type Props = {
  title: string,
  onItemPress: () => void,
  items: any
};

class Menu extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSubtitle = ({ item }) => {
    const { title } = item;
    const { onItemPress } = this.props;
    const name = this.cleanName(title);
    return (
      <View>
        <MenuItem
          onPress={() => {
            onItemPress(item);
            this._menu.hide();
          }}
        >
          {name}
        </MenuItem>
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
    return (
      <MaterialMenu
        ref={ref => {
          this._menu = ref;
        }}
        button={
          /* eslint-disable-next-line */
          <Text style={{ color: "#fff" }} onPress={() => this._menu.show()}>
            {title}
          </Text>
        }
      >
        <FlatList
          data={items}
          renderItem={this.renderSubtitle}
          ItemSeparatorComponent={() => <MenuDivider />}
          keyExtractor={i => i.title}
        />
      </MaterialMenu>
    );
  }
}

export default Menu;
