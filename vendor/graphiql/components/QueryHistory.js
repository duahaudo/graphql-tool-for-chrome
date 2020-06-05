
/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import { parse } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import QueryStore from '../utility/QueryStore';
import HistoryQuery from './HistoryQuery';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const MAX_QUERY_SIZE = 100000;
const MAX_HISTORY_LENGTH = 20;

const shouldSaveQuery = (nextProps, current, lastQuerySaved) => {
  if (nextProps.queryID === current.queryID) {
    return false;
  }

  try {
    parse(nextProps.query);
  } catch (e) {
    return false;
  } // Don't try to save giant queries


  if (nextProps.query.length > MAX_QUERY_SIZE) {
    return false;
  }

  if (!lastQuerySaved) {
    return true;
  }

  if (JSON.stringify(nextProps.query) === JSON.stringify(lastQuerySaved.query)) {
    if (JSON.stringify(nextProps.variables) === JSON.stringify(lastQuerySaved.variables)) {
      return false;
    }

    if (!nextProps.variables && !lastQuerySaved.variables) {
      return false;
    }
  }

  return true;
};

export class QueryHistory extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toggleFavorite", (query, variables, operationName, label, favorite) => {
      const item = {
        query,
        variables,
        operationName,
        label
      };

      if (!this.favoriteStore.contains(item)) {
        item.favorite = true;
        this.favoriteStore.push(item);
      } else if (favorite) {
        item.favorite = false;
        this.favoriteStore.delete(item);
      }

      this.setState({
        queries: [...this.historyStore.items, ...this.favoriteStore.items]
      });
    });

    _defineProperty(this, "editLabel", (query, variables, operationName, label, favorite) => {
      const item = {
        query,
        variables,
        operationName,
        label
      };

      if (favorite) {
        this.favoriteStore.edit({
          ...item,
          favorite
        });
      } else {
        this.historyStore.edit(item);
      }

      this.setState({
        queries: [...this.historyStore.items, ...this.favoriteStore.items]
      });
    });

    this.historyStore = new QueryStore('queries', props.storage, MAX_HISTORY_LENGTH); // favorites are not automatically deleted, so there's no need for a max length

    this.favoriteStore = new QueryStore('favorites', props.storage, null);
    const historyQueries = this.historyStore.fetchAll();
    const favoriteQueries = this.favoriteStore.fetchAll();
    const queries = historyQueries.concat(favoriteQueries);
    this.state = {
      queries
    };
  }

  componentWillReceiveProps(nextProps) {
    if (shouldSaveQuery(nextProps, this.props, this.historyStore.fetchRecent())) {
      const item = {
        query: nextProps.query,
        variables: nextProps.variables,
        operationName: nextProps.operationName
      };
      this.historyStore.push(item);
      const historyQueries = this.historyStore.items;
      const favoriteQueries = this.favoriteStore.items;
      const queries = historyQueries.concat(favoriteQueries);
      this.setState({
        queries
      });
    }
  }

  render() {
    const queries = this.state.queries.slice().reverse();
    const queryNodes = queries.map((query, i) => {
      return React.createElement(HistoryQuery, _extends({
        handleEditLabel: this.editLabel,
        handleToggleFavorite: this.toggleFavorite,
        key: `${i}:${query.label || query.query}`,
        onSelect: this.props.onSelectQuery
      }, query));
    });
    return React.createElement("section", {
      "aria-label": "History"
    }, React.createElement("div", {
      className: "history-title-bar"
    }, React.createElement("div", {
      className: "history-title"
    }, 'History'), React.createElement("div", {
      className: "doc-explorer-rhs"
    }, this.props.children)), React.createElement("ul", {
      className: "history-contents"
    }, queryNodes));
  }

}

_defineProperty(QueryHistory, "propTypes", {
  query: PropTypes.string,
  variables: PropTypes.string,
  operationName: PropTypes.string,
  queryID: PropTypes.number,
  onSelectQuery: PropTypes.func,
  storage: PropTypes.object
});