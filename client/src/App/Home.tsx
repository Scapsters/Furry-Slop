import React from "react";
import { Menu } from "./Home/Menu.tsx";
import TweetData from "../../../interfaces/TweetData.ts";
import "./Home.css";
import { useAsync } from "../UseAsync.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { emptyTweetData } from "../TweetData.tsx";
import { Post } from "./Post.tsx";
import { defaultSettings, SettingsContext } from "./Home/Menu/Settings.tsx";

export const postContext = React.createContext<TweetData>(emptyTweetData);
export const refreshContext = React.createContext<() => void>(() => {});
export const settingsContext =
	React.createContext<SettingsContext>(defaultSettings);

export const Home = () => {
	const { tweetid } = useParams();
	const [tweetData] = useAsync(`Api/Tweets/${tweetid}`, emptyTweetData);

	const navigate = useNavigate();
	const useRefresh = React.useCallback(() => {
		navigate(`/`);
	}, [navigate]);

    
    const [settings, setSettings] = React.useState(defaultSettings);
    const settingsContextMemo = React.useMemo(() => {
        return {
            preloadImages: settings.preloadImages,
            autoRefresh: settings.autoRefresh,
            multiPost: settings.multiPost,
            setSettings: setSettings
        }
    }, [settings]);

	return (
		<postContext.Provider value={tweetData}>
			<refreshContext.Provider value={useRefresh}>
				<settingsContext.Provider value={settingsContextMemo}>
					<div className="home">
						<Post />
						<Menu />
					</div>
				</settingsContext.Provider>
			</refreshContext.Provider>
		</postContext.Provider>
	);
};
