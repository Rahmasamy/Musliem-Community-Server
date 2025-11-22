import Event from "../../models/Event/event.model.js";

// @desc Create new event

export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      startTime,
      endTime,
      date,
      attendance,
      invitationLink,
      eventType,
      Location,
    } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !startTime || !endTime ||  !attendance ) {
    return res.status(400).json({
      success: false,
      message: "Missing data please provide name,start time ,endtime,attendance",
    });
  }
    const existingEvent = await Event.findOne({
      user: req.user._id,
      name: name.trim(),
      Location: Location || "",
    });

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: "You already created this event before",
      });
    }

    const event = new Event({
      user: req.user._id,
      name,
      description,
      image,
      date,
      startTime,
      endTime,
      attendance,
      invitationLink: invitationLink || "",
      eventType,
      Location: Location || "",
      members: [req.user._id],
    });

    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc Get all events (latest first) with pagination
export const getAllEvents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const { search, location, date } = req.query;

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const locationFilter = location
      ? { location: { $regex: location, $options: "i" } }
      : {};

    const dateFilter = date ? { date: { $gte: new Date(date) } } : {};

    // ✅ include only approved events
    const filter = {
      adminApprovalStatus: "approved",
      ...searchFilter,
      ...locationFilter,
      ...dateFilter,
    };

    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      events,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// @desc Get events created by logged-in user
export const getUserEvents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const { search, location, date } = req.query;

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const locationFilter = location
      ? { location: { $regex: location, $options: "i" } }
      : {};

    const dateFilter = date ? { date: { $gte: new Date(date) } } : {};

    const filter = { user: req.user._id, ...searchFilter, ...locationFilter, ...dateFilter };

    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      events,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get specific event by ID
// @route   GET /api/events/:id
// @access  Private (need auth)

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    // ✅ get event with user + members populated
    const event = await Event.findById(eventId)
      .populate("user", "name email") // صاحب الحدث
      .populate("members") // الأعضاء
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getPendingEventsForAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const filter = { adminApprovalStatus: "pending" };

    const total = await Event.countDocuments(filter);

    const pendingEvents = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email photo"); 

    res.status(200).json({
      pendingEvents,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching pending events:", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateEventAdminApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminApprovalStatus } = req.body;

    if (!["pending", "approved", "rejected"].includes(adminApprovalStatus)) {
      return res
        .status(400)
        .json({ message: "Invalid admin approval status value" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { adminApprovalStatus },
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.json({
      message: "Admin approval status updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating admin approval status",
      error: error.message,
    });
  }
};
