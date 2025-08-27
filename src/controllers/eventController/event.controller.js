import Event from '../../models/Event/event.model.js';


// @desc Create new event

export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      startTime,
      endTime,
      attendance,
      invitationLink,
      eventType,
      Location,
    } = req.body;
    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
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
      image: imageUrl,
      startTime,
      endTime,
      attendance,
      invitationLink: invitationLink || "",
      eventType,
      Location: Location || "",
      members: [req.user._id], // صاحب الحدث أول عضو
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
    const page = Number(req.query.page) || 1;  // default page 1
    const limit = 4; // events per load
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments();

    res.json({
      events,
      page,
      totalPages: Math.ceil(total / limit)
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

    const events = await Event.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments({ user: req.user._id });

    res.json({
      events,
      page,
      totalPages: Math.ceil(total / limit)
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
      .populate("user", "name email")       // صاحب الحدث
      .populate("members")    // الأعضاء
      .lean();

    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Event not found" 
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
