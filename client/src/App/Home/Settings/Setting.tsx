import React from "react";
import { settingsContext } from "../../../App.tsx";

export const Setting = ({id, name, min, max}) => {
    const {settings, setSettings} = React.useContext(settingsContext)!;

    return (
        <div>
            <div>{name}</div>
            <input type="range" min={min} max={max} value={settings[id]} onChange={(e) => {
                setSettings({...settings, [id]: e.target.value})
            }} />
        </div>
    )
}