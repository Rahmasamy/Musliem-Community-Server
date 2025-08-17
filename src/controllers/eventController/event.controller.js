import Event from '../../models/Event/event.model.js';


// @desc Create new event

export const createEvent = async (req,res) => {
    try {
  const { name, description, image, startTime, endTime, attendance, invitationLink, eventType } = req.body;

    const event = await Event.create({
      user: req.user._id,
      name,
      description,
      image,
      startTime,
      endTime,
      attendance,
      invitationLink,
      eventType
    });
    await event.save();
    res.status(201).json(event);
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

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