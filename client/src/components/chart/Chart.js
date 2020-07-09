import React, { useRef, useEffect } from "react"
import { Paper, Grid, useMediaQuery } from "@material-ui/core"
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
  const isMD = useMediaQuery("(min-width:700px)")
  const isSM = useMediaQuery("(min-width:600px)")

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
    const margin = { top: 10, right: 30, bottom: 30, left: isSM ? 60 : 45 }
    const svg = select(svgRef.current)
    svg.selectAll(".path").remove()
    const wrapper = select(wrapperRef.current)
    if (!dimensions) return
    if (!data.length) return
    const formattedData = formatData(data)
    const domainData = domainConcat(formattedData)

    const { height, width } = dimensions

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
      .call(isMD ? axisBottom(scaleX) : axisBottom(scaleX).ticks(5))

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
    svg.selectAll(".rect").remove()
    const rect = svg
      .append("rect")
      .attr("class", "rect")
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
            const weekday = new Intl.DateTimeFormat("en-US", {
              weekday: "short",
            }).format(date)

            const range = getDataRange(state.range)
            const dateString =
              range === "yearlyData" || range === "monthlyData"
                ? `<h4>${date.toDateString().slice(4, 11)}</h4>`
                : range === "weeklyData" || range === "dailyData"
                ? `<h4>${weekday}, ${date.toTimeString().slice(0, 5)}</h4>`
                : null
            return dateString.concat(
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
          .style("top", `${event.clientY - 30}px`)
          .style("left", () =>
            this.getBoundingClientRect().width - x > 100
              ? `${event.clientX + 20}px`
              : `${event.clientX - 105}px`
          )
        console.log(x)
        svg.selectAll(".vertical").remove()
        svg
          .append("line")
          .attr("class", "vertical")
          .attr("x1", event.offsetX)
          .attr("y1", 0 + margin.top)
          .attr("x2", event.offsetX)
          .attr("y2", event.offsetY - 4)
          .style("stroke-width", 0.25)
          .style("stroke", "#616161")
          .style("fill", "none")
        svg
          .append("line")
          .attr("class", "vertical")
          .attr("x1", event.offsetX)
          .attr("y1", event.offsetY + 4)
          .attr("x2", event.offsetX)
          .attr("y2", height - margin.bottom)
          .style("stroke-width", 0.25)
          .style("stroke", "#616161")
          .style("fill", "none")
      })
      .on("mouseleave", function () {
        wrapper.selectAll(".tooltip").remove()
        svg.selectAll(".vertical").remove()
      })
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
