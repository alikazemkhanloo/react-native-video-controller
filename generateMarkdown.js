/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function stringOfLength(string, length) {
    let newString = '';
    for (let i = 0; i < length; i++) {
      newString += string;
    }
    return newString;
  }
  
  function generateTitle(name) {
    const title = '`' + name + '` (component)';
    return title + '\n' + stringOfLength('=', title.length) + '\n';
  }
  
  function generateDesciption(description) {
    return description + '\n';
  }
  
  function generatePropType(type) {
    let values;
    if (Array.isArray(type.value)) {
      values =
        '(' +
        type.value
          .map(function(typeValue) {
            return typeValue.name || typeValue.value;
          })
          .join('|') +
        ')';
    } else {
      values = type.value;
    }
  
    return 'type: `' + type.name + (values ? values : '') + '`\n';
  }
  
  function generatePropDefaultValue(value) {
    return 'defaultValue: `' + value.value + '`\n';
  }
  
  function generateProp(propName, prop) {
    return (
      '### `' +
      propName +
      '`' +
      (prop.required ? ' (required)' : '') +
      '\n' +
      '\n' +
      (prop.description ? prop.description + '\n\n' : '') +
      (prop.type ? generatePropType(prop.type) : '') +
      (prop.defaultValue ? generatePropDefaultValue(prop.defaultValue) : '') +
      '\n'
    );
  }
  
  function generateProps(props) {
    if (!props) return '\n';
    const title = 'Props';
  
    return (
      title +
      '\n' +
      stringOfLength('-', title.length) +
      '\n' +
      '\n' +
      Object.keys(props)
        .sort()
        .map(function(propName) {
          return generateProp(propName, props[propName]);
        })
        .join('\n')
    );
  }
  
  function generateMarkdown(name, reactAPI) {
    const markdownString =
      generateTitle(name) +
      '\n' +
      generateDesciption(reactAPI.description) +
      '\n' +
      generateProps(reactAPI.props);
  
    return markdownString;
  }
  
  module.exports = generateMarkdown;