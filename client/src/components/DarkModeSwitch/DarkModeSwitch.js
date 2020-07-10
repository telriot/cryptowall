import React from "react"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { Switch } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Brightness3, Brightness5 } from "@material-ui/icons"
import { useAppDispatch } from "../../contexts/appContext"
import { TYPES } from "../../contexts/types"
const useStyles = makeStyles((theme) => ({
  div: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
}))

function DarkModeSwitch(props) {
  const [state, setState] = React.useState(false)
  const dispatch = useAppDispatch()
  const classes = useStyles()
  const handleChange = (event) => {
    setState(event.target.checked)
    dispatch({ type: TYPES.SET_THEME })
  }

  return (
    <div className={classes.div}>
      <FormControlLabel
        control={
          <Switch
            checked={state}
            onChange={handleChange}
            name="dark-mode-switch"
          />
        }
        label=""
      />
      {state ? (
        <Brightness3 color="secondary" />
      ) : (
        <Brightness5 color="primary" />
      )}
    </div>
  )
}

export default DarkModeSwitch
