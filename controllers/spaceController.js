const StudySpace = require("../models/StudySpace");

const updateStatus = (space) => {
    const percentage = (space.occupiedSeats / space.totalSeats) * 100;

    if (percentage < 40) {
        space.status = "Available";
    } else if (percentage < 75) {
        space.status = "Moderate";
    } else {
        space.status = "Full";
    }
};

const getAllSpaces = async (req, res) => {
    try {
        const spaces = await StudySpace.find();
        res.render("index", { spaces });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookSeat = async (req, res) => {
    try {
        const space = await StudySpace.findById(req.params.id);

        if (!space) {
            return res.status(404).json({ message: "Zone not found" });
        }

        if (space.occupiedSeats >= space.totalSeats) {
            return res.status(400).json({ message: "No seats available" });
        }

        space.occupiedSeats += 1;
        updateStatus(space);

        await space.save();

        res.json({
            success: true,
            occupiedSeats: space.occupiedSeats,
            status: space.status
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const seedData = async () => {
    const existing = await StudySpace.find();

    if (existing.length === 0) {

        const spaces = [
            ["Library", "Silent Zone", 60, 20],
            ["Library", "Discussion Zone", 50, 18],
            ["Library", "Computer Zone", 40, 10],

            ["Cafeteria", "Indoor Dining", 80, 40],
            ["Cafeteria", "Outdoor Dining", 50, 20],
            ["Cafeteria", "Coffee Corner", 30, 12],

            ["Student Central", "Help Desk", 35, 10],
            ["Student Central", "Meeting Area", 40, 15],
            ["Student Central", "Lounge Area", 45, 16]
        ];

        const data = spaces.map(([buildingName, zone, totalSeats, occupiedSeats]) => {
            const space = {
                buildingName,
                zone,
                totalSeats,
                occupiedSeats
            };

            const percentage = (occupiedSeats / totalSeats) * 100;

            if (percentage < 40) {
                space.status = "Available";
            } else if (percentage < 75) {
                space.status = "Moderate";
            } else {
                space.status = "Full";
            }

            return space;
        });

        await StudySpace.insertMany(data);

        console.log("Database Seeded Successfully");
    }
};

module.exports = {
    getAllSpaces,
    bookSeat,
    seedData
};
