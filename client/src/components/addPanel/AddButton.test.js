import React from "react"
import { shallow } from "enzyme"
import { findByTestAttr } from "../../../test/testUtils"
import AddButton from "./AddButton"

const setup = () => {
  return shallow(<AddButton />)
}

test("App renders without error", () => {
  const wrapper = setup()
  const component = findByTestAttr(wrapper, "add-button")
  expect(component.length).toBe(1)
})
