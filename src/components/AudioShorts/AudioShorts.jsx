import React from 'react';
import './AudioShorts.css'; // ვიყენებთ შესაბამის CSS ფაილს

// დროებითი, სტატიკური მონაცემები ვიზუალისთვის
const placeholderShorts = [
    { id: 1, title: 'მოგზაურობა მთვარეზე', author: 'ჟიულ ვერნი' },
    { id: 2, title: 'უხილავი კაცი', author: 'ჰ. ჯ. უელსი' },
    { id: 3, title: 'ზღაპარი მეფე სალტანისა', author: 'ალექსანდრე პუშკინი' },
    { id: 4, title: 'პატარა პრინცი', author: 'ანტუან დე სენტ-ეგზიუპერი' },
    { id: 5, title: 'ალქიმიკოსი', author: 'პაულო კოელიო' },
    { id: 6, title: 'სამი მუშკეტერი', author: 'ალექსანდრე დიუმა' }
];

function AudioShorts() {
    // უწყვეტი ანიმაციისთვის მონაცემებს ვაორმაგებთ
    const shortsForAnimation = [...placeholderShorts, ...placeholderShorts];

    return (
        <div className="audio-shorts-container">
            <h2>აუდიო მოთხრობები</h2>
            <div className="scrolling-wrapper">
                <div className="shorts-grid">
                    {shortsForAnimation.map((short, index) => (
                        <div key={`${short.id}-${index}`} className="short-card">
                            {/* ამოღებულია არასაჭირო <img /> თეგი, რადგან
                                    დიზაინი სრულად იმართება CSS-ით.
                                */}
                            <div className="short-info">
                                <h3>{short.title}</h3>
                                <p>{short.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AudioShorts;
