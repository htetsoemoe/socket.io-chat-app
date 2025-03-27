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