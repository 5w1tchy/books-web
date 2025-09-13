import React from 'react';
import './AudioShorts.css'; // დაგჭირდებათ შესაბამისი CSS ფაილი

// დროებითი, სტატიკური მონაცემები ვიზუალისთვის
const placeholderShorts = [
    { id: 1, title: 'მოგზაურობა მთვარეზე', author: 'ჟიულ ვერნი', imageUrl: 'https://placehold.co/220x220/A5D6A7/FFFFFF?text=Audio&font=raleway' },
    { id: 2, title: 'უხილავი კაცი', author: 'ჰ. ჯ. უელსი', imageUrl: 'https://placehold.co/220x220/90CAF9/FFFFFF?text=Audio&font=raleway' },
    { id: 3, title: 'ზღაპარი მეფე სალტანისა', author: 'ალექსანდრე პუშკინი', imageUrl: 'https://placehold.co/220x220/FFCC80/FFFFFF?text=Audio&font=raleway' },
    { id: 4, title: 'პატარა პრინცი', author: 'ანტუან დე სენტ-ეგზიუპერი', imageUrl: 'https://placehold.co/220x220/CE93D8/FFFFFF?text=Audio&font=raleway' },
    { id: 5, title: 'ალქიმიკოსი', author: 'პაულო კოელიო', imageUrl: 'https://placehold.co/220x220/EF9A9A/FFFFFF?text=Audio&font=raleway' },
    { id: 6, title: 'სამი მუშკეტერი', author: 'ალექსანდრე დიუმა', imageUrl: 'https://placehold.co/220x220/B0BEC5/FFFFFF?text=Audio&font=raleway' }
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
                            <img src={short.imageUrl} alt={short.title} className="short-image"/>
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

