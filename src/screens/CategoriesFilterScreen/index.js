// @flow
import { connect } from "react-redux";
import type { Connector, MapStateToProps } from "react-redux";
import type { NavigationScreenProp } from "react-navigation";
import {
  stageEventFilters,
  commitEventFilters,
  clearStagedEventFilters
} from "../../actions/event-filters";
import type { State } from "../../reducers";
import { selectFilteredEvents } from "../../selectors/events";
import Component from "./component";
import type { Props as ComponentProps } from "./component";

type OwnProps = {
  navigation: NavigationScreenProp<*>
};

type Props = ComponentProps & OwnProps;

const mapStateToProps: MapStateToProps<State, OwnProps, *> = state => ({
  events: selectFilteredEvents(state, true),
  stagedCategories: state.eventFilters.stagedFilters.categories
});

const mapDispatchToProps = {
  onApplyFilters: () => commitEventFilters(),
  toggleCategoryFilter: (stagedCategories, categoryLabel) => {
    const categories = new Set([...stagedCategories]);
    if (!categories.delete(categoryLabel)) categories.add(categoryLabel);
    return stageEventFilters({ categories });
  },
  onClearAll: () => stageEventFilters({ categories: new Set() }),
  onClose: () => clearStagedEventFilters()
};

const connector: Connector<OwnProps, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default connector(Component);
