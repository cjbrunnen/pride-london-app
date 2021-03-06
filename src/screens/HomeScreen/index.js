// @flow
import { connect } from "react-redux";
import type { Connector } from "react-redux";
import type { NavigationScreenProp, NavigationState } from "react-navigation";
import strings from "../../constants/strings";
import type { Event } from "../../data/event";
import type { FieldRef } from "../../data/field-ref";
import getAssetSource from "../../data/get-asset-source";
import type { ImageSource } from "../../data/get-asset-source";
import type { HeaderBanner } from "../../data/header-banner";
import {
  selectFeaturedEventsByTitle,
  selectEventsLoading,
  selectAssetById
} from "../../selectors/events";
import { selectHeaderBanners } from "../../selectors/header-banner";
import Component from "./component";

type OwnProps = {
  navigation: NavigationScreenProp<NavigationState>
};

type Props = {
  headerBanners: HeaderBanner[],
  featuredEventsTitle: string,
  featuredEvents: Event[],
  loading: boolean,
  getAssetSource: FieldRef => ImageSource
} & OwnProps;

const mapStateToProps = state => ({
  headerBanners: selectHeaderBanners(state),
  featuredEventsTitle: strings.featuredEventsTitle,
  featuredEvents: selectFeaturedEventsByTitle(
    state,
    strings.featuredEventsTitle
  ),
  loading: selectEventsLoading(state),
  getAssetSource: getAssetSource(id => selectAssetById(state, id))
});

const mapDispatchToProps = {};

const connector: Connector<OwnProps, Props> = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default connector(Component);
