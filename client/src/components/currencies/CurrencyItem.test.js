import React from "react"
import { shallow } from "enzyme"
import { findByTestAttr } from "../../../test/testUtils"
import CurrencyItem from "./CurrencyItem"

const setup = () => {
  return shallow(<CurrencyItem />)
}

test("App renders without error", () => {
  const wrapper = setup()
  const component = findByTestAttr(wrapper, "currency-item")
  expect(component.length).toBe(1)
})
