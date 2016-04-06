/**
 * Configuration dialog
 */

import React from 'react';

import {Divider, DropDownMenu, List, ListItem, MenuItem, Popover, SelectField, Toggle} from 'material-ui/lib';

export default class Configuration extends React.Component {

  constructor(props, context) {
    super(props, context);

    const disabledPipelines = props.settings.disabledPipelines || [];
    const pipelines = props.pipelines
    .map(p => { return {name : p.name, active: props.settings.disabledPipelines.indexOf(p.name) < 0} })
    .concat(
    props.settings.disabledPipelines.map(dp => {
      return { name : dp, active: false } })
    );
    this.state = {
      // Sort filterable pipelines by name
      pipelines: pipelines.sort((a,b) => a.name > b.name ? 1 : -1),
      // Configurable sort order
      currentSortOrder: {
        name : props.settings.sortOrder.name,
        label: props.settings.sortOrder.label
      },
      // List of sort order options openened or not
      sortOrderListOpened: false
    }
  }

  // Toggles a pipeline on/off
  togglePipeline(p, event) {
    this.props.onTogglePipeline(p.name, event.target.checked);
  }
  
  // Sort order changed
  sortOrderChanged(sortOrder) {
    this.setState({
      currentSortOrder: sortOrder,
      sortOrderListOpened: false
    });
    this.props.onSortOrderChange(sortOrder);
  }

  openSortOrderList(e) {
    this.setState({
      sortOrderListOpened: true,
      anchorEl: e.target
    });
  }

  closeSortOrderList() {
    this.setState({
      sortOrderListOpened: false
    });
  }

  render() {
    
    let sortOrders = 
      (<List>
        {
          this.props.sortOrders.map((s) => {
            return <ListItem key={s.name} primaryText={s.label} onTouchTap={this.sortOrderChanged.bind(this, s)}  />
        }
      ) }
      </List>
    );

    let pipelines = 
    (
      <List subheader="Filter Pipelines">
        { this.state.pipelines.map((p) => {
            return <ListItem key={p.name} primaryText={p.name} rightToggle={<Toggle defaultToggled={p.active} onToggle={this.togglePipeline.bind(this, p)} />} />
        }) }
        <Popover
          open={this.state.sortOrderListOpened}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'center'}}
          targetOrigin={{horizontal: 'left', vertical: 'center'}}
          onRequestClose={this.closeSortOrderList.bind(this)}
          useLayerForClickAway={true}
        >
          {sortOrders}
        </Popover>
      </List>
    );

    return (
      <div>
        <List subheader="General">
          <ListItem primaryText="Sort Order" secondaryText={this.state.currentSortOrder.label} onTouchTap={this.openSortOrderList.bind(this)} />
        <Divider />
        </List>
        {pipelines}
      </div>
    );
  }
}
