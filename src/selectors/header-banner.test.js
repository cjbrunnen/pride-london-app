import { selectHeaderBanners } from "./header-banner";

describe("selectHeaderBanners", () => {
  it("selects property", () => {
    const state = {
      events: {
        entries: [
          { sys: { contentType: { sys: { id: "event" } } } },
          { sys: { contentType: { sys: { id: "headerBanner" } } } }
        ]
      }
    };

    const selected = selectHeaderBanners(state);

    expect(selected.length).toBe(1);
    expect(selected[0]).toBe(state.events.entries[1]);
  });
});
