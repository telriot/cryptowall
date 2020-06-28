import React from "react"
import { shallow } from "enzyme"
import { findByTestAttr } from "../../../test/testUtils"
import AddInput from "./AddInput"

const setup = () => {
  return shallow(<AddInput />)
}

test("App renders without error", () => {
  const wrapper = setup()
  const component = findByTestAttr(wrapper, "add-input")
  expect(component.length).toBe(1)
})
