import React from "react"
import { mount } from "enzyme"
import { findByTestAttr } from "../../../test/testUtils"
import Chart from "./Chart"

const setup = () => {
  return mount(<Chart />)
}

test("Component renders without error", () => {
  const wrapper = setup()
  const component = findByTestAttr(wrapper, "component-chart")
  expect(component.length).toBe(1)
})
