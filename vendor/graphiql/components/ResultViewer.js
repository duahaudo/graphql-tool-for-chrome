function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import commonKeys from '../utility/commonKeys';
/**
 * ResultViewer
 *
 * Maintains an instance of CodeMirror for viewing a GraphQL response.
 *
 * Props:
 *
 *   - value: The text of the editor.
 *
 */

export class ResultViewer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    // Lazily require to ensure requiring GraphiQL outside of a Browser context
    // does not produce an error.
    const CodeMirror = require('codemirror');

    require('codemirror/addon/fold/foldgutter');

    require('codemirror/addon/fold/brace-fold');

    require('codemirror/addon/dialog/dialog');

    require('codemirror/addon/search/search');

    require('codemirror/addon/search/searchcursor');

    require('codemirror/addon/search/jump-to-line');

    require('codemirror/keymap/sublime');

    require('codemirror-graphql/results/mode');

    const Tooltip = this.props.ResultsTooltip;
    const ImagePreview = this.props.ImagePreview;

    if (Tooltip || ImagePreview) {
      require('codemirror-graphql/utils/info-addon');

      const tooltipDiv = document.createElement('div');
      CodeMirror.registerHelper('info', 'graphql-results', (token, options, cm, pos) => {
        const infoElements = [];

        if (Tooltip) {
          infoElements.push(React.createElement(Tooltip, {
            pos: pos
          }));
        }

        if (ImagePreview && typeof ImagePreview.shouldRender === 'function' && ImagePreview.shouldRender(token)) {
          infoElements.push(React.createElement(ImagePreview, {
            token: token
          }));
        }

        if (!infoElements.length) {
          ReactDOM.unmountComponentAtNode(tooltipDiv);
          return null;
        }

        ReactDOM.render(React.createElement("div", null, infoElements), tooltipDiv);
        return tooltipDiv;
      });
    }

    this.viewer = CodeMirror(this._node, {
      lineWrapping: true,
      value: this.props.value || '',
      readOnly: true,
      theme: this.props.editorTheme || 'graphiql',
      mode: 'graphql-results',
      keyMap: 'sublime',
      foldGutter: {
        minFoldSize: 4
      },
      gutters: ['CodeMirror-foldgutter'],
      info: Boolean(this.props.ResultsTooltip || this.props.ImagePreview),
      extraKeys: commonKeys
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  componentDidUpdate() {
    this.viewer.setValue(this.props.value || '');
  }

  componentWillUnmount() {
    this.viewer = null;
  }

  render() {
    return React.createElement("section", {
      className: "result-window",
      "aria-label": "Result Window",
      "aria-live": "polite",
      "aria-atomic": "true",
      ref: node => {
        this._node = node;
      }
    });
  }
  /**
   * Public API for retrieving the CodeMirror instance from this
   * React component.
   */


  getCodeMirror() {
    return this.viewer;
  }
  /**
   * Public API for retrieving the DOM client height for this component.
   */


  getClientHeight() {
    return this._node && this._node.clientHeight;
  }

}

_defineProperty(ResultViewer, "propTypes", {
  value: PropTypes.string,
  editorTheme: PropTypes.string,
  ResultsTooltip: PropTypes.any,
  ImagePreview: PropTypes.any
});