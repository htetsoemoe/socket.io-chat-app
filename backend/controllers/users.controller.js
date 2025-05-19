import UserService from "../services/users.service.js";

// get other users for side bar (except logged in user)
export const getUsersForSideBar = async (req, res) => {
    try {
        const user = req.user;
        const loggedInUserId = user._id;

        const userService = new UserService();
        const users = await userService.getUsersForSideBar(loggedInUserId);
        res.status(200).json({
            data: users,
            status: "success",
            message: "Users fetched successfully",
        })

    } catch (error) {
        console.log(`Error getUsersForSideBar controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        })
    }
}

// OTP Auth: get user's name, isAccountVerified by userId
export const getUserData = async (req, res) => {
    try {
        const userService = new UserService();
        const {_id: userId} = req.user;

        const user = await userService.getUserData(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })            
        }
        
        res.status(200).json({
            userData: user,
            status: "success",
            message: "User data fetched successfully",
        })
    } catch (error) {
        console.log(`Error getUserData controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        })       
    }
}