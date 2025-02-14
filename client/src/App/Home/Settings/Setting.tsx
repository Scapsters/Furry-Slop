import React from "react";
import { settingsContext } from "../../Home.tsx";

export const Setting = ({id, name, min, max}) => {
    const settings = React.useContext(settingsContext);

    return (
        <div>
            <div>{name}</div>
            <input type="range" min={min} max={max} value={settings[id]} onChange={(e) => {
                settings.setSettings({...settings, [id]: e.target.value})
            }} />
        </div>
    )
}