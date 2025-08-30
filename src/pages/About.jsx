import React from 'react';
import './About.css'; // სტილების ფაილი

// დროებითი მონაცემები, რომლებიც შეგიძლიათ შეცვალოთ
const teamMembers = [
  {
    id: 1,
    name: 'ნიკოლოზ ნიშნიანიძე',
    role: 'მთავარი დეველოპერი',
    
    imageUrl: 'https://placehold.co/200x200/3498db/ffffff?text=ნიკოლოზი'
  },
  {
    id: 2,
    name: 'დავით ყიფიანი',
    role: 'პროექტის მენეჯერი',
     imageUrl: 'https://placehold.co/200x200/e74c3c/ffffff?text=დავით'
  },
  {
    id: 3,
    name: 'ზურაბ პაპალაშვილი',
    role: 'ფრონტ ენდ დეველოპერი',
   imageUrl: 'https://placehold.co/200x200/2ecc71/ffffff?text=ზურაბ'
  },
  {
    id: 4,
    name: '......',
    role: '......',
    description: ' .',
    imageUrl: 'https://placehold.co/200x200/f1c40f/ffffff?text='
  }
];

function About() {
  return (
    <div className="about-page">
      <div className="team-section">
        <h1>ჩვენი გუნდის შესახებ</h1>
        <div className="about-container">
          {teamMembers.map(member => (
            <div key={member.id} className="member-card">
              <img src={member.imageUrl} alt={member.name} className="member-image" />
              <div className="member-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ახალი სექცია პროექტის შესახებ --- */}
      <div className="project-section">
        <h2>ჩვენი პროექტის მიზანია</h2>
        <div className="project-container">
          <p>
            ჩვენი პროექტის მიზანია ხალხს ხელმეორედ შევაყვაროთ წიგნები და შეუმსუფუქოთ მათი საყვარელი წიგნების არჩევანზე.
          </p>
          <p>
            ეს პროექტი შეიქმნა იმისთვის, რომ... მოგაწოდოთ საუკეთესო ინფორმაცია წიგნების შესახებ... ჩვენი მთავარი ფასეულობაა ინოვაცია,
            ხარისხი და მომხმარებელზე ზრუნვა. ჩვენი გუნდი ყოველდღიურად მუშაობს იმისთვის, რომ თქვენ ხელმეორედ შეგიყვარდეთ ან გაგიღმავრდეთ წიგნების კითხვა...
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;

