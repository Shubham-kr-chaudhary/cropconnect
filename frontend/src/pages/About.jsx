import abhishekImage from '../assets/abhishek.jpg';
// import shubhamImage from '../assets/shubham.jpg';
// import ramImage from '../assets/ram.jpg';

const teamMembers = [
  {
    name: 'Abhishek Tiwari',
    role: 'Full Stack Developer',
    department: 'Information Technology',
    institution: 'Babu Banarasi Das Northern India Institute of Technology',
    image: abhishekImage,
    rollNumber: '2100560130002',     // replace with actual UR
    yearBatch: 'Final year - 2021-2025',
  },
  {
    name: 'Shubham Kumar Chaudhary',
    role: 'Full Stack Developer',
    department: 'Information Technology',
    institution: 'Babu Banarasi Das Northern India Institute of Technology',
    // image: shubhamImage,
    rollNumber: '2100560130024',     // replace with actual UR
    yearBatch: 'Final year - 2021-2025',
  },
  {
    name: 'Dr. Ram Pratap Singh',
    role: 'Associate Professor',
    department: 'Information Technology',
    institution: 'Babu Banarasi Das Northern India Institute of Technology',
    // image: ramImage,
    designation: 'Associate Professor',
  },
  // Add more members as needed
];

export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Our Team</h1>
      <div className="space-y-6">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center border rounded-lg p-4 shadow-sm"
          >
            {/* Text details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold">{member.name}</h2>
              <p className="italic text-gray-600">
                {member.role}, {member.department}
              </p>
              <p className="mt-2">
                <strong>Institution:</strong> {member.institution}
              </p>
              {member.rollNumber && (
                <p>
                  <strong>Roll No:</strong> {member.rollNumber}
                </p>
              )}
              {member.yearBatch && (
                <p>
                  <strong>Batch:</strong> {member.yearBatch}
                </p>
              )}
              {member.designation && (
                <p>
                  <strong>Designation:</strong> {member.designation}
                </p>
              )}
            </div>

            {/* Image on the right */}
            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
