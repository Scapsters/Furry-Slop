import React from "react";
import "./Settings.css";
import { Setting } from "./Settings/Setting.tsx";

export type Settings = {
	preloadImages: number;
	autoRefresh: number;
	multiPost: number;
};

export type SettingsContext = {
	settings: Settings;
	setSettings: (settings: Settings) => void;
};

export const defaultSettings: Settings = {
	preloadImages: 0,
	autoRefresh: 0,
	multiPost: 0,
};

export const SettingsMenu = () => {
	return (
		<div className="settings">
			<div className="login">ur not logged in</div>
			<div className="options">
				<Setting
					id="preloadImages"
					name="Preload Images"
					min={0}
					max={32}
				/>
				<Setting
					id="autoRefresh"
					name="Auto Refresh"
					min={0}
					max={30}
				/>
				<Setting id="multiPost" name="Multi Post" min={1} max={8} />
			</div>
		</div>
	);
};
