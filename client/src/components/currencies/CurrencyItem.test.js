import React from "react"
import CurrencyItem from "./CurrencyItem"
import { SocketStateContext } from "../../contexts/socketContext"
import { render, fireEvent, cleanup } from "@testing-library/react"
import axios from "axios"

afterEach(cleanup)

let socket = { current: { emit: jest.fn() } }

describe("CurrencyItem tests", () => {
  test("CurrencyItem renders successfully", () => {})
})
