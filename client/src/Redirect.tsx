import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

export const Redirect = () => {
    const navigate = useNavigate();
    useEffect(() => { navigate("/tweets/"); })
}

export default Redirect;