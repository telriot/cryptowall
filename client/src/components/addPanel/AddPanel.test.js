import React from "react"
import { mount } from "enzyme"
import { findByTestAttr } from "../../../test/testUtils"
import AddPanel from "./AddPanel"

const setup = () => {
  return mount(<AddPanel />)
}

test("Component renders without error", () => {
  const wrapper = setup()
  const component = findByTestAttr(wrapper, "component-add-panel")
  expect(component.length).toBeTruthy()
})
