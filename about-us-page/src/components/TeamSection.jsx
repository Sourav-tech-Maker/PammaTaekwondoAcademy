import React from 'react';
import './TeamSection.css';

const TeamSection = () => {
    const teamMembers = [
        {
            name: 'Pamma aka Paramjeet Singh',
            role: 'Head Coach',
            image: 'https://randomuser.me/api/portraits/men/32.jpg', // Replace with your image URL or local path
            description: 'Pamma leads our academy with passion and discipline.'
        },
        {
            name: 'Naresh Sidhu',
            role: 'Assistant Coach',
            image: 'https://randomuser.me/api/portraits/women/44.jpg', // Replace with your image URL or local path
            description: 'Simran inspires students with her dedication and skill.'
        },
        {
            name: 'Sourav',
            role: 'Fitness Trainer',
            image: 'https://randomuser.me/api/portraits/men/45.jpg', // Replace with your image URL or local path
            description: 'Sourav ensures everyone stays in top on Self-Defense and Sparring.'
        },

        {
            name: 'Sachin',
            role: 'Fitness Trainer',
            image: 'data:image/jpeg;base64,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', // Replace with your image URL or local path
            description: 'Sachin ensures everyone stays in top shape.'
        }
    ];

    return (
        <section className="team-section">
            <h2>Meet Our Team</h2>
            <div className="team-members">
                {teamMembers.map((member, index) => (
                    <div className="team-member" key={index}>
                        <img src={member.image} alt={member.name} />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                        <p>{member.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;