import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";

export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Group name is required" });
        }

        const group = await Group.create({
            name,
            description,
            createdBy: req.user._id
        });

        await GroupMember.create({
            group: group._id,
            user: req.user._id,
            role: "ADMIN"
        });

        return res.status(201).json({
            message: "Group created successfully",
            group
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMyGroups = async (req, res) => {
    const memberships = await GroupMember.find({
        user: req.user._id
    }).populate("group");

    const groups = memberships.map(m => m.group);
    
    res.status(200).json({
        message: "Groups fetched successfully",
        groups
    });
};