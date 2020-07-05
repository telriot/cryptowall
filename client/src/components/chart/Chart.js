import React, { useRef, useEffect } from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { AppStateContext } from "../../contexts/appContext"
import useResizeObserver from "../../hooks/useResizeObserver"
import { SocketStateContext } from "../../contexts/socketContext"
import {
  select,
  scaleTime,
  extent,
  event,
  axisBottom,
  axisLeft,
  scaleLinear,
  line,
  mouse,
} from "d3"
export const palette = [
  "#8338ecff",
  "#3a86ffff",
  "#ffbe0bff",
  "#fb5607ff",
  "#ff006eff",
  "#7fb800",
  "#011627",
  "#0ead69",
  "#706677",
  "#f2b5d4",
]

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 500,
    width: "100%",
  },
  tooltip: {
    backgroundColor: "#f3f3f3",
    padding: "0px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    lineHeight: 0.4,
    zIndex: 10,
    whiteSpace: "nowrap",
  },
}))

function Chart() {
  const { socketState } = React.useContext(SocketStateContext)
  const state = React.useContext(AppStateContext)

  const filterSocketData = (data) => {
    return data.filter((el) => {
      return !state.hiddenCoins.has(el.id)
    })
  }

  const data = socketState.data.length ? filterSocketData(socketState.data) : []
  const classes = useStyles()
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const day = new Date()
  const startingDay = day.setDate(day.getDate() - state.range)
  const today = new Date()
  const getDataRange = (timeframe) => {
    switch (timeframe) {
      case 1:
        return "dailyData"
      case 7:
        return "weeklyData"
      case 30:
        return "monthlyData"
      case 365:
        return "yearlyData"
    }
  }
  const formatData = (data) => {
    let dataRange = getDataRange(state.range)
    let items = []
    for (let item of data) {
      items.push(item[dataRange].map((el) => ({ x: el[0], y: el[1] })))
    }
    return items
  }
  const domainConcat = (data) => {
    let concatItem = []
    for (let group of data) {
      concatItem = concatItem.concat(group)
    }
    return concatItem
  }

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll(".path").remove()
    const wrapper = select(wrapperRef.current)
    if (!dimensions) return
    if (!data.length) return
    const formattedData = formatData(data)
    const domainData = domainConcat(formattedData)

    const { height, width } = dimensions
    const margin = { top: 10, right: 30, bottom: 30, left: 60 }
    const tooltipScale = scaleLinear()
      .domain([0, width - margin.left - margin.right])
      .range([startingDay, Date.parse(today)])
    const tooltipScaleToIndex = scaleLinear()
      .domain([startingDay, Date.parse(today)])
      .range([0, formattedData[0].length])

    const scaleX = scaleTime()
      .domain([startingDay, Date.parse(today)])
      .range([margin.left, width - margin.right])
    svg
      .select(".x-axis")
      .attr(`transform`, `translate(0,${height - margin.bottom})`)
      .call(axisBottom(scaleX))

    const scaleY = scaleLinear()
      .domain(extent(domainData, (d) => d.y))
      .range([height - margin.bottom, margin.top])
    svg
      .select(".y-axis")
      .attr(`transform`, `translate(${margin.left},0)`)
      .call(axisLeft(scaleY))
    svg
      .selectAll(".path")
      .data(formattedData)
      .join("path")
      .attr("class", "path")
      .attr("fill", "none")
      .attr("stroke", (d, index) => {
        const coinId = data[index]["id"]
        const dataIndex = socketState.data.findIndex((el) => el.id === coinId)
        return palette[dataIndex]
      })
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        line()
          .x((d) => {
            if (scaleX(d.x) > margin.left) return scaleX(d.x)
            return margin.left
          })
          .y((d) => {
            return scaleY(d.y)
          })
      )
    const rect = svg
      .append("rect")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("opacity", 0)

    rect
      .on("mousemove", function (value, index) {
        const [x] = mouse(this)
        wrapper.select(".tooltip").remove()
        wrapper

          .selectAll(".tooltip")
          .data(formattedData)
          .join("div")
          .attr("class", `tooltip ${classes.tooltip}`)

          .html(() => {
            const time = tooltipScale(x)
            const xIndex = parseInt(tooltipScaleToIndex(time))
            const date = new Date(time)
            return `<h4>${date.toDateString().slice(4, 11)}</h4>`.concat(
              data
                .map((coin) => {
                  let dataRange = getDataRange(state.range)
                  if (!coin[dataRange][xIndex]) return "<div/>"
                  return `<div>
                  <p>${coin.symbol.toUpperCase()}: ${coin[dataRange][
                    xIndex
                  ][1].toFixed(4)}</p> 
                </div>`
                })
                .join(" ")
            )
          })
          .style("position", "absolute")
          .style("top", `${event.clientY}px`)
          .style("left", `${event.clientX + 20}px`)
      })
      .on("mouseleave", () => wrapper.selectAll(".tooltip").remove())
  }, [data, dimensions, state.range])
  return (
    <Grid item xs={12}>
      <Paper
        className={classes.paper}
        elevation={2}
        data-test="component-chart"
        ref={wrapperRef}
      >
        <svg
          className="chart-bar"
          style={{
            height: dimensions ? dimensions.height : "100%",
            width: "100%",
          }}
          ref={svgRef}
        >
          <g className="x-axis"></g>
          <g className="y-axis"></g>
        </svg>
      </Paper>
    </Grid>
  )
}

export default Chart
