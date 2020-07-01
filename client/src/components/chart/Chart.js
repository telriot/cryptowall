import React, { useRef, useEffect } from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import useResizeObserver from "../../hooks/useResizeObserver"
import { SocketStateContext } from "../../contexts/socketContext"
import {
  select,
  scaleTime,
  extent,
  axisBottom,
  axisLeft,
  min,
  max,
  scaleLinear,
  line,
} from "d3"

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 500,
    width: "100%",
  },
}))

function Chart() {
  const { socketState } = React.useContext(SocketStateContext)
  const data = socketState.data.length ? socketState.data[0].yearlyData : []
  const classes = useStyles()
  const svgRef = useRef()
  const wrapperRef = useRef()

  const dimensions = useResizeObserver(wrapperRef)

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll(".path").remove()
    const wrapper = select(wrapperRef.current)
    if (!dimensions) return
    if (!data) return
    const { height, width } = dimensions
    const margin = { top: 10, right: 30, bottom: 30, left: 60 }
    // Add X axis --> it is a date format
    const x = scaleTime()
      .domain(
        extent(data, (d) => {
          return d[0]
        })
      )
      .range([50, width])
    svg
      .select(".x-axis")
      .attr(`transform`, `translate(0,${height - 30})`)
      .call(axisBottom(x))

    // Add Y axis
    const y = scaleLinear()
      .domain(
        extent(data, (d) => {
          return d[1]
        })
      )
      .range([height - 30, 0])
    svg.select(".y-axis").attr(`transform`, `translate(50,0)`).call(axisLeft(y))

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("class", "path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        line()
          .x((d) => {
            return x(d[0])
          })
          .y((d) => {
            return y(d[1])
          })
      )
  }, [data, dimensions])
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
