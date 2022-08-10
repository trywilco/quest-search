/* eslint-disable */
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import TestRenderer from "react-test-renderer";
import Banner from "./components/Home/Banner";

const mockStore = configureStore([]);

test("Check that Banner contains a search box", () => {
  const testRenderer = TestRenderer.create(
    <MemoryRouter>
      <Provider store={mockStore({})}>
        <Banner />
      </Provider>
    </MemoryRouter>
  );

  const searchBox = testRenderer?.root?.findByType("input");

  expect(searchBox).toBeDefined();
  expect(searchBox.props.id).toBe("search-box");
});
