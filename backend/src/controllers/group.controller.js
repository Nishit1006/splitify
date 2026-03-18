// import { Group } from "../models/group.model.js";
// import { GroupMember } from "../models/groupMember.model.js";

// export const createGroup = async (req, res) => {
//     try {
//         const { name, description } = req.body;

//         if (!name) {
//             return res.status(400).json({ message: "Group name is required" });
//         }

//         const group = await Group.create({
//             name,
//             description,
//             createdBy: req.user._id
//         });

//         await GroupMember.create({
//             group: group._id,
//             user: req.user._id,
//             role: "ADMIN"
//         });

//         return res.status(201).json({
//             message: "Group created successfully",
//             group
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// export const getMyGroups = async (req, res) => {
//     const memberships = await GroupMember.find({
//         user: req.user._id
//     }).populate("group");

//     const groups = memberships.map(m => m.group);

//     res.status(200).json({
//         message: "Groups fetched successfully",
//         groups
//     });
// };

import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { Settlement } from "../models/settlement.model.js";

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
    try {
        const memberships = await GroupMember.find({
            user: req.user._id
        }).populate("group");

        const groups = memberships.map(m => m.group);

        res.status(200).json({
            message: "Groups fetched successfully",
            groups
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;

        const members = await GroupMember.find({ group: groupId })
            .populate("user", "username fullName avatar _id");

        const group = await Group.findById(groupId);

        return res.status(200).json({
            message: "Members fetched successfully",
            data: {
                group,
                members: members.map(m => ({
                    _id: m._id,
                    user: m.user,
                    role: m.role,
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Check group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only the group creator can delete it
        if (group.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the group creator can delete this group" });
        }

        // Get all expenses in the group
        const expenses = await Expense.find({ groupId });
        const expenseIds = expenses.map(e => e._id);

        // Delete all expense splits for this group's expenses
        if (expenseIds.length > 0) {
            await ExpenseSplit.deleteMany({ expenseId: { $in: expenseIds } });
        }

        // Delete all expenses
        await Expense.deleteMany({ groupId });

        // Delete all settlements
        await Settlement.deleteMany({ groupId });

        // Delete all group members
        await GroupMember.deleteMany({ group: groupId });

        // Finally delete the group
        await Group.findByIdAndDelete(groupId);

        return res.status(200).json({
            message: "Group deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};