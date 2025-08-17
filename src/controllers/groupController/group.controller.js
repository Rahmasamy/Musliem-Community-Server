import Group from "../../models/Group/group.model.js";



export const createGroup = async (req, res) => {
    try {
        const { name, description, joinOption, members } = req.body;
        const image = req.body.image || req.file?.path || "";

        // Ensure the creator (Admin) is in the list
        const creator = { user: req.user._id, role: "admin" };
        const finalMembers = members ? [...members, creator] : [creator];

        const group = await Group.create({
            name,
            description,
            image,
            joinOption,
            createdBy: req.user._id,
            members: finalMembers
        });

        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getSingleGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate("members.user", "-password")
        if (!group) return res.status(404).json({ message: "Group not found" });
        res.status(200).json(group);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


// Get all groups (paginated)
export const getAllGroups = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const [groups, total] = await Promise.all([
            Group.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Group.countDocuments()
        ]);

        res.json({ groups, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (group.members.some(member => member.user.toString() === req.user._id.toString()))
            return res.status(400).json({
                message: "User already a member of this group "
            })
        group.members.push({ user: req.user._id, role: "member" })
        await group.save()
         res.json(group);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const leaveGroup = async (req,res) => {
    try {
  const group = await Group.findById(req.params.id)
        if (!group) return res.status(404).json({ message: "Group not found" });
        console.log(group)
        group.members = group.members.filter( member => member.user.toString() !== req.user._id.toString())
         await group.save();
    res.json({ message: "Left group" });
    }
     catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const getUserGroups = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [groups, total] = await Promise.all([
      Group.find({ "members.user": req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Group.countDocuments({ "members.user": req.user._id })
    ]);

    res.json({ groups, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};