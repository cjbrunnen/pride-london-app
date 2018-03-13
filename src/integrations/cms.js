// @flow

import Config from "react-native-config";
// force contentful SDK to use browser API
import { createClient } from "contentful/dist/contentful.browser.min";
import { saveEvents, loadEvents } from "./storage";

import type { Event } from "../data/event";

export type Deletion = {
  sys: {
    id: string
  }
};
type EventData = {
  entries: Event[],
  deletedEntries: Deletion[],
  nextSyncToken: string
};
type SyncOpts = {
  initial: boolean,
  nextSyncToken?: string
};
type Client = {
  sync: SyncOpts => Promise<EventData>
};

type UpdateEvents = () => Promise<Event[]>;
type GetEvents = (
  loadEvents?: loadEvents,
  updateEvents?: updateEvents
) => Promise<Event[]>;

const client: Client = createClient({
  space: Config.CONTENTFUL_SPACE_ID,
  accessToken: Config.CONTENTFUL_API_KEY
});

export const getEvents: GetEvents = async (
  loadEventsFn = loadEvents,
  updateEventsFn = updateEvents
) => {
  const localEventsData = await loadEventsFn();
  const hasLocalEventsData =
    !!localEventsData && localEventsData.events.length > 0;

  if (hasLocalEventsData) {
    return localEventsData.events;
  }

  return updateEventsFn();
};

export const updateEvents: UpdateEvents = async (
  loadEventsFn = loadEvents,
  saveEventsFn = saveEvents,
  clientObj = client
) => {
  const localEventsData = await loadEventsFn();
  const hasLocalEventsData =
    !!localEventsData && localEventsData.events.length > 0;

  const syncOpts = hasLocalEventsData
    ? {
        initial: false,
        nextSyncToken: localEventsData.syncToken
      }
    : {
        initial: true
      };

  const cmsData = await clientObj.sync(syncOpts);

  if (
    hasLocalEventsData &&
    localEventsData.syncToken === cmsData.nextSyncToken
  ) {
    return localEventsData.events;
  }

  const events = cmsData.entries.filter(
    entry => entry.sys.contentType.sys.id === "event"
  );
  const deletedEvents = cmsData.deletedEntries;

  const savedEventsData = await saveEventsFn(
    events,
    deletedEvents,
    cmsData.nextSyncToken
  );

  return savedEventsData.events;
};
