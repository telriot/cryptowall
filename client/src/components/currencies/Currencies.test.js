import React from "react"
import { mount } from "enzyme"
import { findByTestAttr } from "../../../test/testUtils"
import Currencies from "./Currencies"

const setup = () => {
  return mount(<Currencies />)
}

test("Component renders without error", () => {
  const wrapper = setup()
  const component = findByTestAttr(wrapper, "component-currencies")
  expect(component.length).toBeTruthy()
})
