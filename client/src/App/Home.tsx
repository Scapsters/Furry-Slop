import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TweetData from "../../../interfaces/TweetData.ts";
import "./Home.css";
import { useAsync } from "../UseAsync.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { emptyTweetData } from "../TweetData.tsx";
import { Post } from "./Post.tsx";
import {
	defaultSettings,
	Settings,
	SettingsContext,
} from "./Home/Settings.tsx";
import { Info } from "./Home/Info.tsx";
import { Refresh } from "./Home/Refresh.tsx";

export const settingsContext =
	React.createContext<SettingsContext>(defaultSettings);

export const Home = () => {
	const { tweetid } = useParams();
	const navigate = useNavigate();

	// Settings is a context with a setter that is memoized to reduce redenders of recipients of the context
	const [settings, setSettings] = useState(defaultSettings);
	const settingsContextMemo = useMemo(
		() => ({ ...settings, setSettings }),
		[settings]
	);

	// Refreh is a state that will be changed by <Settings/> to alter refresh behavior of <Refresh/>
    const refreshCallback = useCallback(() => navigate("/"), [navigate]);
	const [refresh, setRefresh] = useState(() => refreshCallback);
    
	// PostCache is a ref that will be set to fill by an async function every render.
	const postCache = useRef<TweetData[]>([]);

	// TweetData is an async hook that will return the defaultTweetData until return
	const [tweetData] = useAsync(`Api/Tweets/${tweetid}`, emptyTweetData);

    // if(settings.autoRefresh > 0) {
    //     setTimeout(() => { refreshCallback()}, settings.autoRefresh * 1000, );
    // }
    
	return (
		<settingsContext.Provider value={settingsContextMemo}>
			<div className="home">
				<Post tweetData={tweetData} refresh={refresh} />
				<div className="evenly-spaced-row menu">
					<Info tweetData={tweetData} />
					<Refresh refresh={refresh} />
					<Settings />
				</div>
			</div>
		</settingsContext.Provider>
	);

    // Thank you copilot vvv
    // pwease cwean me up uwu :3 :3 :3 
};
