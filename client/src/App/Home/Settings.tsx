import React from "react";
import "./Settings.css";
import { Setting } from "./Settings/Setting.tsx";

export type SettingsContext = {
	preloadImages: number;
	autoRefresh: number;
	multiPost: number;
    setSettings: React.Dispatch<React.SetStateAction<SettingsContext>>
};

export const defaultSettings: SettingsContext = {
	preloadImages: 0,
	autoRefresh: 0,
	multiPost: 0,
    setSettings: () => {}
};

export const Settings = () => {
	return (
		<div className="settings">
			<div className="login">ur not logged in</div>
			<div className="options">
				<Setting id='preloadImages' name='Preload Images' min={0} max={32} />
                <Setting id='autoRefresh' name='Auto Refresh' min={0} max={30} />
                <Setting id='multiPost' name='Multi Post' min={1} max={8} />
			</div>
		</div>
	);
};
