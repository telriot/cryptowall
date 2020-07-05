import React from "react"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"

function DarkModeSwitch() {
  const [state, setState] = React.useState(false)

  const handleChange = (event) => {
    setState(event.target.checked)
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={state}
          onChange={handleChange}
          name="dark-mode-switch"
        />
      }
      label="Night mode"
    />
  )
}

export default DarkModeSwitch
