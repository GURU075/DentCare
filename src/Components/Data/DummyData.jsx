// Get today's date
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0-indexed
const day = today.getDate();

// Example appointments for today
export const appointments = [
    {
        title: 'Morning Stand-up Meeting',
        startDate: new Date(year, month, day, 9, 0), // 9:00 AM today
        endDate: new Date(year, month, day, 9, 30),
        id: 0,
        location: 'Meeting Room 1',
    },
    {
        title: 'Code Review Session',
        startDate: new Date(year, month, day, 11, 0), // 11:00 AM today
        endDate: new Date(year, month, day, 12, 0),
        id: 1,
        location: 'Online Meeting',
    },
    {
        title: 'Lunch with Team',
        startDate: new Date(year, month, day, 13, 0), // 1:00 PM today
        endDate: new Date(year, month, day, 14, 0),
        id: 2,
        location: 'Cafeteria',
    },
    {
        title: 'Project Planning',
        startDate: new Date(year, month, day, 15, 0), // 3:00 PM today
        endDate: new Date(year, month, day, 17, 0),
        id: 3,
        location: 'Conference Room B',
    },

    // Example appointments for tomorrow (day + 1)
    {
        title: 'Client Meeting - Project X',
        startDate: new Date(year, month, day + 1, 10, 0), // 10:00 AM tomorrow
        endDate: new Date(year, month, day + 1, 11, 30),
        id: 4,
        location: 'Client Office',
    },
    {
        title: 'Sprint Retrospective',
        startDate: new Date(year, month, day + 1, 14, 0), // 2:00 PM tomorrow
        endDate: new Date(year, month, day + 1, 15, 0),
        id: 5,
        location: 'Meeting Room 2',
    },
];