import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard=()=> {
    const {user,clearUser}=useContext(UserContext);
    const navigate = useNavigate();

    const handleLogOut=()=>{
        localStorage.clear();
        clearUser();
        navigate("/");
    };

    return (
        <div className="text-[15px] text-black font-bold leading-3">
            <div>
                <div
                    className=""
                >
                    {user?.name || ""}
                </div>
                <button
                    className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"
                    onClick={handleLogOut}
                >
                    Log Out
                </button>
            </div>
        </div>
    )
}

export default ProfileInfoCard